import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import nodeFetch from "node-fetch";
import UserInfoDao, { UserInfoDaoNS } from "../../../dao/UesrInfoDao";
import Notification from "rc-notification";
import { NotificationInstance as RCNotificationInstance } from "rc-notification/lib/Notification";
import { getSessionInfoData } from "../../../api";

let notificationInstance: RCNotificationInstance | null = null;
Notification.newInstance(
  {
    style: { top: 60, left: 0 },
    maxCount: 1
  },
  (n) => {
    notificationInstance = n;
  }
);

interface LiveRoomListsProps {
  refresh: (e: null) => void;
}

// 获取二维码图片和key
async function getQRCode() {
  const response = await fetch(
    "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
    {
      credentials: "include"
    }
  );
  return await response.json();
}

// 轮询二维码扫码状态
async function pollQRCode(oauthKey: string) {
  return await nodeFetch(
    `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${ oauthKey }`,
    {
      credentials: "include"
    }
  );
}

export default function CustomStyledPanel(props: LiveRoomListsProps) {
  const { t } = useTranslation();
  const { refresh } = props;
  const [qrcodeImg, setQrcodeImg] = useState<string>("");
  const [oauthKey, setOauthKey] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [tipText, setTipText] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number>(-1);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const onNotificationMessage = (msg: NoticeData) => {
    const noticeOption = {
      className: "warning",
      content: (
        <span>
          <span className="icon-font icon-item warning icon-report" />
          { msg.msg }
        </span>
      ),
      duration: 6
    };
    notificationInstance.notice(noticeOption);
  };

  function parseMultiCookieString(cookieStr) {
    // 空值保护
    if (!cookieStr || typeof cookieStr !== "string") {
      return {};
    }
    const cookieObj = {};
    const cookieList = cookieStr.split(",").map(item => item.trim());
    cookieList.forEach(cookieItem => {
      const cookieParts = cookieItem.split(";");
      if (cookieParts.length === 0) return;
      const [key, value] = cookieParts[0].split("=").map(part => part.trim());
      if (key && value !== undefined) {
        cookieObj[key] = value;
      }
    });
    return cookieObj;
  }

  async function fetchQRCode() {
    const res = await getQRCode();
    if (res.data) {
      setTipText('');
      setStatusCode(-1)
      setQrcodeImg(res.data.url);
      const newOauthKey = res.data.qrcode_key;
      setOauthKey(newOauthKey);

      if (newOauthKey) {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
        // 轮询扫码状态
        pollInterval.current = setInterval(async () => {
          const response = await pollQRCode(newOauthKey);
          const resData = await response.json();
          if (resData.code === 0) {
            setStatusCode(resData.data.code)
            if (resData.data.code === 0) {
              const cookieObj = parseMultiCookieString(response.headers.get("set-cookie"));
              const userSession = cookieObj.SESSDATA;
              setTipText(`登录成功`);
              setStatusCode(0)
              setToken(userSession);
              const sessionInfo = await getSessionInfoData(userSession);
              if (!sessionInfo.uid) {
                const warning = {
                  msg: t("SessionError")
                };
                onNotificationMessage(warning);
                return;
              }
              UserInfoDao.save(UserInfoDaoNS.UserInfoUid, String(sessionInfo.uid));
              UserInfoDao.save(UserInfoDaoNS.UserInfoSession, userSession);
              refresh(null);
              if (pollInterval.current) clearInterval(pollInterval.current);
            } else if (resData.data.code === 86038) {
              setTipText("二维码已失效");
            } else if (resData.data.code === 86090) {
              setTipText("二维码已扫描，请在手机上确认...");
            } else if (resData.data.code === 86101) {
              setTipText("等待扫码...");
            } else {
              setTipText(`未知状态 ${ resData.data.message }`);
            }
          }
        }, 2000);
      }
    }
  }

  useEffect(() => {
    fetchQRCode();
  }, []);

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  return (
    <div className="flex-column-center">
      <div className="scanBox">
        { qrcodeImg && <QRCodeSVG value={ qrcodeImg } size={ 120 } /> }
        {
          statusCode === 86038 && <div className="login_qrcode_tip" onClick={() => fetchQRCode()}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAARVBMVEUAAAAAruwArusAruwAruwArewAq+sArusAresAr+sAruwAr+8Aru8AruwAruwAr+cArewAr+0AruwArewAr98ArusAruy8BWrbAAAAFnRSTlMA76DfcL9AMJBAgCAQz68gYI9fUBDPY12YwgAAAUZJREFUOMuNlFuShCAMRcNTQEBbp9n/UkcTuhnKKHN/rIqHXBII0MvrrEQpIuXg4VYxHEyTkjOPvcpFHKpFYaQ2OLQb813x+vxx626t1VLVwOvwOj6p2hoMCmebxSSJTNGeHwq+MWQW6LQQahBsvkIzGyfyA67ITcBoohIJnHHfyHFkA3EnmsV8COkLzthZPl1pqgkXFnSNUwDqNiGsDdzAPlQC2pCkBQiUd6xMzmMl7M1AMQKcDfUDLpzFlBFInRb/AKkxaL2PQYH9Xp8wumwJ2+OeMDrkDHrYcDQNYIfVTJUQI2+JnnTYYr7F2n2NOD/3YLuvrjwdt24DEAUO4UMlaqmLRuO69bOhWd++J4Z95GYKv6EppkLoH38vKWZ+2MlUUnvvd+1UDbjLaKrCiHu5FnnlHNoyqOqyBcR42ZCTOBiVtYVOvw1hKHrM5JK6AAAAAElFTkSuQmCC" />
            <span>二维码已过期</span>
            <span>请点击刷新</span>
          </div>
        }
        {
          [0, 86090].includes(statusCode) && <div className="login_qrcode_tip" onClick={() => fetchQRCode()}>
            <span>{tipText}</span>
          </div>
        }
      </div>
      <div style={ { textAlign: "center", marginTop: 4 } }>
        { token ? (
          <span>登录成功！</span>
        ) : (
          <span>请使用B站APP扫码登录</span>
        ) }
      </div>
    </div>
  );
}
