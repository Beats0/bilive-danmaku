import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Tooltip from 'rc-tooltip';
import { TFunction } from 'i18next';
import MsgVip from './MsgVip';
import MsgUserAvatar from './MsgUserAvatar';
import {
  ConfigKey,
  configStateType,
  rootStatePropsType
} from '../../../reducers/types';
import { updateConfig } from '../../../actions/config';
import { currentTranslateToCode, translate } from '../../../utils/translation';
import { openLink } from '../../../utils/common';
import { read } from '../../../utils/vioce';

interface MsgDanmuProps extends DanmakuMsg {
  t: TFunction;
  config: configStateType;
  updateConfig: typeof updateConfig;
}

function MsgDanmu(props: MsgDanmuProps) {
  const { t, config, updateConfig } = props;

  const [showToolTip, setShowToolTip] = useState(false);
  let [translateContent, setTranslateContent] = useState(props.content);

  // 翻译文字
  const handleTranslate = () => {
    translate(props.content, {
      from: 'auto',
      to: currentTranslateToCode()
    })
      .then(translateObj => {
        translateContent = `${translateObj.text}`;
        setTranslateContent(translateContent);
      })
      .catch((e: any) => {
        console.log(e);
        translateContent = `${props.content}(${t('TranslateFailed')})`;
        setTranslateContent(translateContent);
      })
      .finally(() => {
        setShowToolTip(false);
      });
  };

  useEffect(() => {
    if (config.autoTranslate === 1) {
      handleTranslate();
    }
  }, []);

  // 屏蔽用户
  const handleBlockUser = (uid: number) => {
    let { blockUserLists } = config;
    blockUserLists.push(uid);
    blockUserLists = [...new Set(blockUserLists)];
    updateConfig({ k: ConfigKey.blockUserLists, v: blockUserLists });
    setShowToolTip(false);
  };

  // 屏蔽对应弹幕文字
  const handleBlockDanmaku = (text: string) => {
    let { blockDanmakuLists } = config;
    blockDanmakuLists.push(text);
    blockDanmakuLists = [...new Set(blockDanmakuLists)];
    updateConfig({ k: ConfigKey.blockDanmakuLists, v: blockDanmakuLists });
    setShowToolTip(false);
  };

  const danmakuActionMenu = (uid: number, uname: string, text: string) => {
    return (
      <div className="danmakuActionMenu">
        <span className="danmakuActionMenuUser pointer" onClick={() => openLink(`https://space.bilibili.com/${uid}`)}>{uname}</span>
        <span className="danmakuActionMenuItem pointer" onClick={handleTranslate}>{t('DanmakuTranslate')}</span>
        <span className="danmakuActionMenuItem pointer" onClick={() => read(uname, text)}>{t('DanmakuRead')}</span>
        <span className="danmakuActionMenuItem pointer" onClick={() => handleBlockUser(uid)}>{t('DanmakuBlockUser')}</span>
        <span className="danmakuActionMenuItem pointer" onClick={() => handleBlockDanmaku(text)}>{t('DanmakuBlockSimilar')}</span>
      </div>
    )
  }

  return (
    <div className={["danmakuItem", props.guardLevel ? `danmakuItem danmaku-item guard-level-${props.guardLevel} guard-danmaku` : ''].join(' ')}>
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
            <div className={ [props.fanLv && `fans-medal-item level-${ props.fanLv }`] }>
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
        {props.username}:
      </span>
      <Tooltip
        visible={showToolTip}
        animation="zoom"
        placement="top"
        onVisibleChange={v => setShowToolTip(v)}
        trigger="click"
        overlay={danmakuActionMenu(props.userID, props.username, props.content)}
      >
        <span className="danmaku-content v-middle pointer ts-dot-2 open-menu">
          {translateContent}
          {props.repeat > 0 && (<span className={`repeatNum repeat-num-${props.repeat}`}>{props.repeat}</span>)}
        </span>
      </Tooltip>
    </div>
  );
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      updateConfig
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MsgDanmu);
