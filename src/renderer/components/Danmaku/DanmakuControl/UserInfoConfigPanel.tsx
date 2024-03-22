import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserInfoDao, { UserInfoDaoNS } from '../../../dao/UesrInfoDao';

const UserInfoUidStr = UserInfoDao.get(UserInfoDaoNS.UserInfoUid);
const UserInfoBuvidStr = UserInfoDao.get(UserInfoDaoNS.UserInfoBuvid);

interface LiveRoomListsProps {
  refresh: (e: null) => void;
}

export default function CustomStyledPanel(props: LiveRoomListsProps) {
  const { t } = useTranslation();
  const { refresh } = props;
  const [uid, setUid] = useState(UserInfoUidStr);
  const [buvid, setBuvid] = useState(UserInfoBuvidStr);

  const handleRefresh = () => {
    UserInfoDao.save(UserInfoDaoNS.UserInfoUid, uid);
    UserInfoDao.save(UserInfoDaoNS.UserInfoBuvid, buvid);
    refresh(null);
  };

  return (
    <div className="container">
      <h1 className="title">{t('ParameterDescription')}</h1>
      <div className="danmaku-adjust-row3">
        <div>{t('ParameterDescriptionText')}</div>
        <p style={{ marginTop: 6 }}>var uid = (/DedeUserID=(.+?)(;|\s|$)/.exec(document.cookie) || [])[1]</p>
        <p>console.log('uid', uid)</p>
        <p>var buvid = (/buvid3=(.+?)(;|\s|$)/.exec(document.cookie) || [])[1]</p>
        <p>console.log('buvid', buvid)</p>
      </div>
      <h1 className="title title-sub">{t('Parameter')}</h1>
      <div className="danmaku-adjust-row3 flex">
        <span className="danmaku-adjust-label-small v-middle dp-i-block">
          uid
        </span>
        <input
          type="text"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="link-input t-center v-middle border-box level-input custom-style"
        />
      </div>
      <div className="danmaku-adjust-row3 flex">
        <span className="danmaku-adjust-label-small v-middle dp-i-block">
          buvid
        </span>
        <input
          type="text"
          value={buvid}
          onChange={(e) => setBuvid(e.target.value)}
          className="link-input t-center v-middle border-box level-input custom-style"
        />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('Refresh')} <span onClick={() => handleRefresh()} className="icon-font icon-item icon-replace icon-config-reset" /></span>
      </div>
    </div>
  );
}
