import React, { memo, useState } from 'react';
import styled from 'styled-components';
import Tooltip from 'rc-tooltip';
import MsgVip from './MsgVip';
import MsgUserAvatar from './MsgUserAvatar';
import { ConfigKey } from '../../../reducers/types';
import { openLink } from '../../../utils/common';
import StyledDao, { StyledDaoNS } from '../../../dao/StyledDao';
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectConfig, updateConfig } from "../../../store/features/configSlice";
import { useTranslation } from "react-i18next";

const UserWrapperStr = StyledDao.get(StyledDaoNS.UserWrapper);
const UserWrapper = styled.span`
  ${UserWrapperStr}
`;

const ContentWrapperStr = `text-shadow: 1px 1px 2px #00b6ff, 0 0 0.2em #0fb3f5;`
const ContentWrapper = styled.span`
  ${ContentWrapperStr}
`;


function MsgDanmuCard(props: DanmakuCard) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  const [showToolTip, setShowToolTip] = useState(false);

  // 屏蔽用户
  const handleBlockUser = (uid: number) => {
    let blockUserLists = JSON.parse(JSON.stringify(config.blockUserLists));
    blockUserLists.push(uid);
    blockUserLists = [...new Set(blockUserLists)];
    dispatch(updateConfig({ k: ConfigKey.blockUserLists, v: blockUserLists }));
    setShowToolTip(false);
  };

  // 屏蔽对应弹幕文字
  const handleBlockDanmaku = (text: string) => {
    let blockDanmakuLists = JSON.parse(JSON.stringify(config.blockDanmakuLists));
    blockDanmakuLists.push(text);
    blockDanmakuLists = [...new Set(blockDanmakuLists)];
    dispatch(updateConfig({ k: ConfigKey.blockDanmakuLists, v: blockDanmakuLists }));
    setShowToolTip(false);
  };


  const danmakuActionMenu = (uid: number, uname: string, text: string) => {
    return (
      <div className="danmakuActionMenu">
        <span className="danmakuActionMenuUser pointer" onClick={() => openLink(`https://space.bilibili.com/${uid}`)}>{uname}</span>
        <span className="danmakuActionMenuItem pointer" onClick={() => handleBlockUser(uid)}>{t('DanmakuBlockUser')}</span>
        <span className="danmakuActionMenuItem pointer" onClick={() => handleBlockDanmaku(text)}>{t('DanmakuBlockSimilar')}</span>
      </div>
    )
  }

  return (
    <div className={["danmakuItem", props.guardLevel ? `danmakuItem danmaku-item ${config.blockEffectItem5 === 0 ? `guard-level-${props.guardLevel}` : '' } guard-danmaku` : ''].join(' ')}>
      {
        config.showAvatar === 1 && MsgUserAvatar(props.userID, props.face)
      }
      {
        props.isAdmin && <div className="admin-icon dp-i-block v-middle" />
      }
      <i
        className={['v-middle bg-center bg-no-repeat pointer', props.guardLevel ? `dp-i-block guard-icon guard-level-${props.guardLevel}` : ''].join(' ')} />
      <MsgVip {...props} />
      {
        props.fanLv && config.showFanLabel === 1 && (
          <div className="fans-medal-item-ctnr dp-i-block p-relative v-middle">
            <div className={ [props.fanLv && `fans-medal-item level-${ props.fanLv > 20 ? 20 : props.fanLv}`] }>
              <span className="label">{ props.fanName }</span>
              <span className="level">{ props.fanLv }</span>
            </div>
          </div>
        )
      }
      {
        config.showLvLabel === 1 && <div className={`user-level-icon dp-i-block p-relative v-middle ${props.userLevel && `lv-${props.userLevel}`}`}>UL {props.userLevel}</div>
      }
      <span className={`user-name v-middle pointer open-menu ${props.guardLevel ? 'guard' : ''}`}>
         <UserWrapper>
           {props.username}:
         </UserWrapper>
      </span>
      <Tooltip
        visible={showToolTip}
        animation="zoom"
        placement="top"
        onVisibleChange={v => setShowToolTip(v)}
        trigger="click"
        overlay={danmakuActionMenu(props.userID, props.username, props.card_content.title)}
      >
        <span className="danmaku-card-content v-middle pointer ts-dot-2 open-menu">
          <ContentWrapper>
            <span onClick={() => openLink(props.card_content.url)}>{props.card_content.title} - {props.card_content.forward_source}</span>
            {props.repeat > 0 && (<span className={`repeatNum repeat-num-${props.repeat}`}>{props.repeat}</span>)}
          </ContentWrapper>
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(MsgDanmuCard);
