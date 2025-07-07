import { useState } from "react";
import { ipcRenderer } from "electron";
import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { ConfigKey } from "../../../reducers/types";
import voice from "../../../utils/vioce";
import {
  arrayDiff,
  hasNewVersion,
  isInclude,
  openLink,
  setCssVariable,
  systemFonts,
  toPercentNum,
  tranNumber
} from "../../../utils/common";
import Switch from "../../Base/Switch";
import Slider from "../../Base/Slider";
import { parseData } from "../MsgModel";
import LanguagePanel from "./LanguagePanel";
import TtsPanel from "./TtsPanel";
import CustomStyledPanel from "./CustomStyledPanel";
import UserConfigPanel from "./UserInfoConfigPanel"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { resetConfig, selectConfig, updateConfig } from "../../../store/features/configSlice";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";

export enum ControlType {
  USERINFOCONFIG = 'USERINFOCONFIG',
  DANMAKUTEST = 'DANMAKUTEST',
  SETTING = 'SETTING',
  TRANSLATESETTING = 'TRANSLATESETTING',
  EFFECTBLOCK = 'EFFECTBLOCK',
  CLEAR = 'CLEAR',
  BLOCK = 'BLOCK',
  UNLOCK = 'UNLOCK',
  CONFIG = 'CONFIG',
  ABOUT = 'ABOUT',
}

type Props = {
  popular: number;
  clearSCMessage: () => void;
  clearMessage: () => void;
  refresh: () => void;
  onMessage: OnMessageFunc;
};

interface OnMessageFunc {
  (msg: DanmakuData[]): void;
}

export interface HandleUpdateConfigFunc {
  (k: ConfigKey, v?: number | string | string[]): void;
}

function DanmakuControl(props: Props) {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectConfig);
  const [currentName, setCurrentName] = useState('');

  const {
    popular,
    clearMessage,
    clearSCMessage,
    refresh,
  } = props;
  const { t } = useTranslation();

  const handleUpdateConfig: HandleUpdateConfigFunc = (
    k: ConfigKey,
    v?: number | string
  ) => {
    switch (k) {
      case ConfigKey.showVoice:
      case ConfigKey.ttsEngine:
      case ConfigKey.edgeTTSVoice:
        if (v === 0) {
          voice.reset();
        }
        break;
      case ConfigKey.voiceSpeed:
        v = v / 100;
        voice.updatePlaybackRate(v);
        break;
      case ConfigKey.voiceVolume:
        v = v / 100;
        voice.updateVolume(v);
        break;
      case ConfigKey.blockScrollBar:
      case ConfigKey.blockMode:
        v = config[k] === 0 ? 1 : 0;
        break;
      case ConfigKey.backgroundColor:
        setCssVariable(
          ConfigKey.backgroundColor,
          v === 0
            ? `rgba(255,255,255, ${config.backgroundOpacity})`
            : `rgba(0,0,0, ${config.backgroundOpacity})`
        );
        break;
      case ConfigKey.backgroundOpacity:
        v = v / 100;
        setCssVariable(
          ConfigKey.backgroundColor,
          config.backgroundColor === 0
            ? `rgba(255,255,255 ${v})`
            : `rgba(0,0,0, ${v})`
        );
        break;
      case ConfigKey.fontFamily:
        setCssVariable(ConfigKey.fontFamily, v);
        break;
      case ConfigKey.avatarSize:
        setCssVariable(ConfigKey.avatarSize, `${v}px`);
        break;
      case ConfigKey.fontSize:
        setCssVariable(ConfigKey.fontSize, `${v}px`);
        break;
      case ConfigKey.fontLineHeight:
        setCssVariable(ConfigKey.fontLineHeight, `${v}px`);
        break;
      case ConfigKey.fontMarginTop:
        setCssVariable(ConfigKey.fontMarginTop, `${v}px`);
        break;
      default:
    }
    if (/blockEffectItem/g.test(k)) {
      v = config[k] === 0 ? 1 : 0;
    }
    dispatch(updateConfig({ k, v }));
  };

  const handleClickControl = (controlName: ControlType) => {
    switch (controlName) {
      case ControlType.EFFECTBLOCK:
        break;
      case ControlType.CLEAR:
        clearMessage();
        break;
      case ControlType.BLOCK:
        handleUpdateConfig(ConfigKey.blockScrollBar);
        break;
      case ControlType.UNLOCK:
        break;
      case ControlType.CONFIG:
        break;
      default:
        break;
    }
    setCurrentName(controlName);
  };

  const handleDispatchResetConfig = () => {
    dispatch(resetConfig());
  };

  const handleToggleDevTools = () => {
    ipcRenderer.send('toggleDevTools');
  };

  const isDev = process.env.NODE_ENV === 'development'
  const newVersion = hasNewVersion(config.version, config.latestVersion);

  return (
    <div id="danmakuControlOuter">
      <div className="popular">
        <span title={t('LiveRoomWatched')} className="icon-font icon-item icon-popular" />{tranNumber(popular)}
      </div>
      <div id="danmakuControl" className="icon-right-part superChat">
        {
          isDev ?
            <Tooltip visible={ currentName === ControlType.DANMAKUTEST }
                     animation="zoom"
                     placement="top"
                     onVisibleChange={ (v) => setCurrentName(v ? ControlType.DANMAKUTEST : "") }
                     trigger="click"
                     overlay={ <DanmakuTest { ...props } /> }>
              <span title="弹幕测试" className="icon-font icon-item icon-comment" />
            </Tooltip>
            : null
        }
        <Tooltip
          visible={ currentName === ControlType.USERINFOCONFIG }
          animation="zoom"
          placement="top"
          onVisibleChange={ (v) => setCurrentName(v ? ControlType.USERINFOCONFIG : "") }
          trigger="click"
          overlay={ <UserConfigPanel { ...props } refresh={refresh} /> }
        >
          <span title="{t('UserConfig')}" className="icon-font icon-item icon-user" />
        </Tooltip>
        <Tooltip
          visible={currentName === ControlType.SETTING}
          animation="zoom"
          placement="top"
          onVisibleChange={(v) => setCurrentName(v ? ControlType.SETTING : '')}
          trigger="click"
          overlay={<SettingContent {...props} handleUpdateConfig={handleUpdateConfig} handleDispatchResetConfig={handleDispatchResetConfig} />}
        >
          <span title={t('DanmakuControlSetting')} className="icon-font icon-item icon-set-up" />
        </Tooltip>
        <Tooltip
          visible={currentName === ControlType.TRANSLATESETTING}
          animation="zoom"
          placement="top"
          onVisibleChange={(v) => setCurrentName(v ? ControlType.TRANSLATESETTING : '')}
          trigger="click"
          overlay={<TranslateSetting {...props} handleUpdateConfig={handleUpdateConfig} />}
        >
          <span title={t('TranslateControlSetting')} className="icon-font icon-item icon-replace" style={{fontSize: 18}} />
        </Tooltip>
        <Tooltip
          visible={currentName === ControlType.EFFECTBLOCK}
          animation="zoom"
          placement="top"
          onVisibleChange={(v) => setCurrentName(v ? ControlType.EFFECTBLOCK : '')}
          trigger="click"
          overlay={<EffectBlock {...props} handleUpdateConfig={handleUpdateConfig} clearSCMessage={clearSCMessage} />}
        >
          <span title={t('DanmakuControlEffectBlock')} onClick={() => handleClickControl(ControlType.EFFECTBLOCK)} className="icon-item icon-font gift-block icon-block-on" />
        </Tooltip>
        <Tooltip
          visible={currentName === ControlType.UNLOCK}
          animation="zoom"
          placement="topRight"
          align={{
            offset: [35, -4]
          }}
          overlayClassName="danmakuBlockToolTip"
          onVisibleChange={(v) => setCurrentName(v ? ControlType.UNLOCK : '')}
          trigger="click"
          overlay={<DanmakuBlock {...props} handleUpdateConfig={handleUpdateConfig} />}
        >
          <span title={t('DanmakuControlDanmakuBlock')} onClick={() => handleClickControl(ControlType.UNLOCK)} className="icon-item icon-font icon-block" />
        </Tooltip>
        <span title={t('DanmakuControlClearHistory')} onClick={() => handleClickControl(ControlType.CLEAR)} className="icon-item icon-font icon-clear" />
        <span title={t('DanmakuControlBlockScroll')} onClick={() => handleClickControl(ControlType.BLOCK)} className={`icon-item icon-font ${config.blockScrollBar ? 'icon-lock-1 active' : 'icon-unlock-1'}`} />
        <span title="Dev Tools" onClick={handleToggleDevTools} className="icon-font icon-item icon-no-modified" />
        <Tooltip
          visible={currentName === ControlType.ABOUT}
          animation="zoom"
          placement="topRight"
          align={{
            offset: [35, -4]
          }}
          onVisibleChange={(v) => setCurrentName(v ? ControlType.ABOUT : '')}
          trigger="click"
          overlay={<About {...props} newVersion={newVersion} />}
        >
          <span title={newVersion ? t('DanmakuControlUpdate') : t('DanmakuControlAbout')}
                onClick={() => handleClickControl(ControlType.ABOUT)}
                className={`icon-item icon-font icon-question ${newVersion && 'update-icon-item'}`}
          />
        </Tooltip>
      </div>
    </div>
  );
}

function DanmakuTest(props: { onMessage: OnMessageFunc }) {
  const { onMessage } = props;
  const lists = [
    {id: 'DANMU_MSG', 'cmd': 'DANMU_MSG', 'info': [[0, 1, 25, 16777215, 1588757852749, 1588757795, 0, '833999c8', 0, 0, 0], '(´；ω；`)', [107658253, '小柯逗B', 0, 0, 0, 10000, 1, ''], [], [12, 0, 6406234, '>50000'], ['', ''], 0, 0, null, { 'ts': 1588757852, 'ct': 'C61CBE3A' }, 0, 0, null, null, 0] },
    {id: 'DANMU_MSG3', "cmd": "DANMU_MSG", "info": [ [ 0, 4, 25, 14893055, 1647315657594, 1114778426, 0, "49c94279", 0, 0, 5, "#1453BAFF,#4C2263A2,#3353BAFF", 0, "{}", "{}", { "mode": 0, "show_player_type": 0, "extra": "{\"send_from_me\":false,\"mode\":0,\"color\":14893055,\"dm_type\":0,\"font_size\":25,\"player_mode\":4,\"show_player_type\":0,\"content\":\"蜘蛛侠就是彼得帕克是吧，我知道，因为这是\",\"user_hash\":\"1237926521\",\"emoticon_unique\":\"\",\"bulge_display\":0,\"direction\":0,\"pk_direction\":0,\"quartet_direction\":0,\"yeah_space_type\":\"\",\"yeah_space_url\":\"\",\"jump_to_url\":\"\",\"space_type\":\"\",\"space_url\":\"\"}" } ], "蜘蛛侠就是彼得帕克是吧，我知道，因为这是", [ 478883246, "蓝猫品牌的衣服", 0, 0, 0, 10000, 1, "#00D1F1" ], [ 23, "脆鲨", "七海Nana7mi", 21452505, 1725515, "", 0, 6809855, 1725515, 5414290, 3, 1, 434334701 ], [ 10, 0, 9868950, ">50000", 0 ], [ "", "" ], 0, 3, null, { "ts": 1647315657, "ct": "C67DE23F" }, 0, 0, null, null, 0, 105 ] },
    {id: 'DANMU_MSG2', "cmd": "DANMU_MSG", "info": [ [ 0, 1, 25, 9920249, 1647315575017, 1647313536, 0, "2a20a2f5", 0, 0, 2, "#19897EFF,#403F388E,#33897EFF", 0, "{}", "{}", { "mode": 0, "show_player_type": 0, "extra": "{\"send_from_me\":false,\"mode\":0,\"color\":9920249,\"dm_type\":0,\"font_size\":25,\"player_mode\":1,\"show_player_type\":0,\"content\":\"漏我总督了\",\"user_hash\":\"706781941\",\"emoticon_unique\":\"\",\"bulge_display\":0,\"direction\":0,\"pk_direction\":0,\"quartet_direction\":0,\"yeah_space_type\":\"\",\"yeah_space_url\":\"\",\"jump_to_url\":\"\",\"space_type\":\"\",\"space_url\":\"\"}" } ], "漏我总督了", [ 3540855, "相劝", 0, 0, 0, 10000, 1, "#E17AFF" ], [ 26, "脆鲨", "七海Nana7mi", 21452505, 398668, "", 0, 16771156, 398668, 6850801, 2, 1, 434334701 ], [ 20, 0, 6406234, ">50000", 0 ], [ "", "" ], 0, 2, null, { "ts": 1647315575, "ct": "D8DD85CC" }, 0, 0, null, null, 0, 112 ] },
    {id: 'DANMU_MSG1', "cmd": "DANMU_MSG", "info": [ [ 0, 1, 25, 8322816, 1647315419735, 1639028927, 0, "603278be", 0, 0, 1, "#33FFE99E,#40DCA731,#33FFE99E", 0, "{}", "{}", { "mode": 0, "show_player_type": 0, "extra": "{\"send_from_me\":false,\"mode\":0,\"color\":8322816,\"dm_type\":0,\"font_size\":25,\"player_mode\":1,\"show_player_type\":0,\"content\":\"好好好\",\"user_hash\":\"1613920446\",\"emoticon_unique\":\"\",\"bulge_display\":0,\"direction\":0,\"pk_direction\":0,\"quartet_direction\":0,\"yeah_space_type\":\"\",\"yeah_space_url\":\"\",\"jump_to_url\":\"\",\"space_type\":\"\",\"space_url\":\"\"}" } ], "好好好", [ 279698, "30块SC", 0, 0, 0, 10000, 1, "#FF7C28" ], [ 31, "脆鲨", "七海Nana7mi", 21452505, 2951253, "", 0, 16771156, 2951253, 10329087, 1, 1, 434334701 ], [ 40, 0, 10512625, 32363, 0 ], [ "", "" ], 0, 1, null, { "ts": 1647315419, "ct": "4BAADCCE" }, 0, 0, null, null, 0, 119 ] },
    {id: 'SEND_GIFT1', 'cmd': 'SEND_GIFT', 'data': { 'giftName': '辣条', 'num': 1000, 'uname': 'Saver-yuan', 'face': 'http://i1.hdslb.com/bfs/face/2c9054349f4fca2db397d00ecc91da9dabaf7d67.jpg', 'guard_level': 0, 'rcost': 421436697, 'uid': 6186224, 'top_list': [], 'timestamp': Date.now(), 'giftId': 1, 'giftType': 0, 'action': '喂食', 'super': 0, 'super_gift_num': 0, 'super_batch_gift_num': 0, 'batch_combo_id': '', 'price': 100, 'rnd': '7816743', 'newMedal': 0, 'newTitle': 0, 'medal': [], 'title': '', 'beatId': '', 'biz_source': 'live', 'metadata': '', 'remain': 0, 'gold': 0, 'silver': 0, 'eventScore': 0, 'eventNum': 0, 'smalltv_msg': [], 'specialGift': null, 'notice_msg': [], 'smallTVCountFlag': true, 'capsule': null, 'addFollow': 0, 'effect_block': 1, 'coin_type': 'silver', 'total_coin': 1300, 'effect': 0, 'broadcast_id': 0, 'draw': 0, 'crit_prob': 0, 'tag_image': '', 'send_master': null, 'is_first': true, 'demarcation': 2, 'combo_stay_time': 3, 'combo_total_coin': 0, 'tid': '1588757584122400001' } },
    {id: 'SEND_GIFT2', 'cmd': "SEND_GIFT", "data":{"giftName":"未名之花","num":1,"uname":"我有只夏目","face":"http://i2.hdslb.com/bfs/face/40b64b9a2512f592c38a6b25130a3584e51774cb.jpg","guard_level":0,"rcost":206695823,"uid":31540862,"top_list":[],"timestamp":1589984907,"giftId":30569,"giftType":0,"action":"投喂","super":0,"super_gift_num":1,"super_batch_gift_num":1,"batch_combo_id":"batch:gift:combo_id:31540862:7946235:30569:1:1589984907.4157","price":100,"rnd":"1333414292","newMedal":0,"newTitle":0,"medal":[],"title":"","beatId":"","biz_source":"live","metadata":"","remain":0,"gold":0,"silver":0,"eventScore":0,"eventNum":0,"smalltv_msg":[],"specialGift":null,"notice_msg":[],"smallTVCountFlag":true,"capsule":null,"addFollow":0,"effect_block":0,"coin_type":"gold","total_coin":100,"effect":0,"broadcast_id":0,"draw":0,"crit_prob":0,"combo_send":{"uid":31540862,"uname":"我有只夏目","gift_num":1,"combo_num":1,"gift_id":30569,"gift_name":"未名之花","action":"投喂","combo_id":"gift:combo_id:31540862:7946235:30569:1589984907.4147","send_master":null},"batch_combo_send":{"uid":31540862,"uname":"我有只夏目","gift_num":1,"batch_combo_num":1,"gift_id":30569,"gift_name":"未名之花","action":"投喂","batch_combo_id":"batch:gift:combo_id:31540862:7946235:30569:1:1589984907.4157","send_master":null},"tag_image":"","send_master":null,"is_first":true,"demarcation":1,"combo_stay_time":1,"combo_total_coin":100,"tid":"1589984907121200005"}},
    {id: 'SEND_GIFT3', "cmd":"SEND_GIFT", "data":{"giftName":"比心","num":1,"uname":"顾飞他大哥","face":"http://i0.hdslb.com/bfs/face/ec32e4529678b9cab57406462a06a3919418ca45.jpg","guard_level":0,"rcost":289908394,"uid":53695158,"top_list":[],"timestamp":1590569382,"giftId":20014,"giftType":0,"action":"投喂","super":0,"super_gift_num":1,"super_batch_gift_num":100,"batch_combo_id":"batch:gift:combo_id:53695158:2206456:20014:1:1590569382.8989","price":520,"rnd":"392817903","newMedal":0,"newTitle":0,"medal":[],"title":"","beatId":"","biz_source":"live","metadata":"","remain":0,"gold":0,"silver":0,"eventScore":0,"eventNum":0,"smalltv_msg":[],"specialGift":null,"notice_msg":[],"smallTVCountFlag":true,"capsule":null,"addFollow":0,"effect_block":0,"coin_type":"gold","total_coin":520,"effect":0,"broadcast_id":0,"draw":0,"crit_prob":0,"combo_send":{"uid":53695158,"uname":"顾飞他大哥","gift_num":1,"combo_num":1,"gift_id":20014,"gift_name":"比心","action":"投喂","combo_id":"gift:combo_id:53695158:2206456:20014:1590569382.8979","send_master":null},"batch_combo_send":{"uid":53695158,"uname":"顾飞他大哥","gift_num":1,"batch_combo_num":1,"gift_id":20014,"gift_name":"比心","action":"投喂","batch_combo_id":"batch:gift:combo_id:53695158:2206456:20014:1:1590569382.8989","send_master":null},"tag_image":"","send_master":null,"is_first":true,"demarcation":1,"combo_stay_time":2,"combo_total_coin":520,"tid":"1590569382121800001"}},
    {id: 'NOTICE_MSG', 'cmd': 'NOTICE_MSG', 'full': { 'head_icon': 'http://i0.hdslb.com/bfs/live/b29add66421580c3e680d784a827202e512a40a0.webp', 'tail_icon': 'http://i0.hdslb.com/bfs/live/822da481fdaba986d738db5d8fd469ffa95a8fa1.webp', 'head_icon_fa': 'http://i0.hdslb.com/bfs/live/49869a52d6225a3e70bbf1f4da63f199a95384b2.png', 'tail_icon_fa': 'http://i0.hdslb.com/bfs/live/38cb2a9f1209b16c0f15162b0b553e3b28d9f16f.png', 'head_icon_fan': 24, 'tail_icon_fan': 4, 'background': '#66A74EFF', 'color': '#FFFFFFFF', 'highlight': '#FDFF2FFF', 'time': 20 }, 'half': { 'head_icon': 'http://i0.hdslb.com/bfs/live/ec9b374caec5bd84898f3780a10189be96b86d4e.png', 'tail_icon': '', 'background': '#85B971FF', 'color': '#FFFFFFFF', 'highlight': '#FDFF2FFF', 'time': 15 }, 'side': { 'head_icon': 'http://i0.hdslb.com/bfs/live/e41c7e12b1e08724d2ab2f369515132d30fe1ef7.png', 'background': '#F4FDE8FF', 'color': '#79B48EFF', 'highlight': '#388726FF', 'border': '#A9DA9FFF' }, 'roomid': 8808199, 'real_roomid': 8808199, 'msg_common': '<%73025543771_bili%>投喂<%良良Nolan%>1个小电视飞船，点击前往TA的房间去抽奖吧', 'msg_self': '<%73025543771_bili%>投喂<%良良Nolan%>1个小电视飞船，快来抽奖吧', 'link_url': 'http://live.bilibili.com/8808199?live_lottery_type=1&broadcast_type=0', 'msg_type': 2, 'shield_uid': -1, 'business_id': '25' },
    {id: 'WELCOME_GUARD', 'cmd': 'WELCOME_GUARD', 'data': { 'uid': 84446943, 'username': '玥玥什', 'guard_level': 3, 'mock_effect': 0 } },
    {id: 'INTERACT_WORD', "cmd": "INTERACT_WORD", "data": {"contribution": {"grade": 0}, "dmscore": 2, "fans_medal": {"anchor_roomid": 0, "guard_level": 0, "icon_id": 0, "is_lighted": 0, "medal_color": 0, "medal_color_border": 0, "medal_color_end": 0, "medal_color_start": 0, "medal_level": 0, "medal_name": "", "score": 0, "special": "", "target_id": 0}, "identities": [1], "is_spread": 0, "msg_type": 1, "roomid": 11365, "score": 1640946731287, "spread_desc": "", "spread_info": "", "tail_icon": 0, "timestamp": 1640946731, "trigger_time": 1640946730237268000, "uid": 371922360, "uname": "\u662f\u5f20\u6155\u4e4b\u6602", "uname_color": ""} },
    {id: 'SUPER_CHAT_MESSAGE1', 'cmd': 'SUPER_CHAT_MESSAGE', 'data': { 'id': '279277', 'uid': 4613957, 'price': 30, 'rate': 1000, 'message': '酸了，我也想让echo一个一个字念名字', 'trans_mark': 0, 'is_ranked': 1, 'message_trans': '', 'background_image': 'http://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png', 'background_color': '#EDF5FF', 'background_icon': '', 'background_price_color': '#7497CD', 'background_bottom_color': '#2A60B2', 'ts': 1588838695, 'token': '3957F115', 'medal_info': { 'icon_id': 0, 'target_id': 456368455, 'special': '', 'anchor_uname': '黑桃影', 'anchor_roomid': 21641569, 'medal_level': 11, 'medal_name': '盗影团', 'medal_color': '#a068f1' }, 'user_info': { 'uname': '缚鹿入炉忽鹿乳濡芦', 'face': 'http://i2.hdslb.com/bfs/face/d88aed0b09fb2842c6bab81a62d989d0d5f19c70.jpg', 'face_frame': '', 'guard_level': 0, 'user_level': 14, 'level_color': '#61c05a', 'is_vip': 1, 'is_svip': 0, 'is_main_vip': 0, 'title': '0', 'manager': 0 }, 'time': 59, 'start_time': 1588838694, 'end_time': 1588838754, 'gift': { 'num': 1, 'gift_id': 12000, 'gift_name': '醒目留言' } } },
    {id: 'SUPER_CHAT_MESSAGE2', "cmd": "SUPER_CHAT_MESSAGE", "data": { "id": "308797", "uid": 26549632, "price": 30, "rate": 1000, "message": "律，我可以抱着律酱的抱枕睡觉嘛", "trans_mark": 1, "is_ranked": 0, "message_trans": "律ちゃんの抱き枕を抱いて寝てもいいですか？", "background_image": "http://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png", "background_color": "#EDF5FF", "background_icon": "", "background_price_color": "#7497CD", "background_bottom_color": "#2A60B2", "ts": 1589636618, "token": "6F1F1B02", "medal_info": { "icon_id": 0, "target_id": 6055289, "special": "", "anchor_uname": "高槻律official", "anchor_roomid": 947447, "medal_level": 11, "medal_name": "D65", "medal_color": "#a068f1", }, "user_info": { "uname": "歌を好きsan", "face": "http://i2.hdslb.com/bfs/face/8739f3b43ad8315a453afcad19ee199b1080f3e0.jpg", "face_frame": "http://i0.hdslb.com/bfs/live/78e8a800e97403f1137c0c1b5029648c390be390.png", "guard_level": 3, "user_level": 23, "level_color": "#5896de", "is_vip": 0, "is_svip": 0, "is_main_vip": 1, "title": "title-179-1", "manager": 0, }, "time": 7200, "start_time": 1589636618, "end_time": 1589636678, "gift": { "num": 1, "gift_id": 12000, "gift_name": "醒目留言" }, }, "_roomid": 947447},
    {id: 'COMBO_SEND', 'cmd': 'COMBO_SEND', 'data': { 'uid': 299378145, 'ruid': '194484313', 'uname': '我来保护你QAQ', 'r_uname': 'Asaki大人', 'combo_num': 4, 'gift_id': 30229, 'gift_num': 2, 'batch_combo_num': 2, 'gift_name': '白金手柄', 'action': '投喂', 'combo_id': 'gift:combo_id:299378145:194484313:30229:1588948182.1419', 'batch_combo_id': 'batch:gift:combo_id:299378145:194484313:30229:2:1588948182.1427', 'is_show': 0, 'send_master': {} } },
    {id: 'COMBO_END', 'cmd': 'COMBO_END', 'data': { 'uid': 299378145, 'ruid': 194484313, 'uname': '我来保护你QAQ', 'r_uname': 'Asaki大人', 'combo_num': 4, 'gift_num': 2, 'batch_combo_num': 4, 'price': 2000, 'gift_name': '白金手柄', 'action': '投喂', 'gift_id': 30229, 'start_time': 1588948182, 'end_time': 1588948186, 'guard_level': 0, 'send_master': {} } },
    {id: 'ROOM_REAL_TIME_MESSAGE_UPDATE', 'cmd': 'ROOM_REAL_TIME_MESSAGE_UPDATE', 'data': { 'roomid': 21641569, 'fans': 160543, 'red_notice': -1 } },
    {id: 'ROOM_CHANGE', 'cmd': 'ROOM_CHANGE', 'data': { 'title': 'Love Hotel V3', 'area_id': 199, 'parent_area_id': 1, 'area_name': '虚拟主播', 'parent_area_name': '娱乐' } },
    {id: 'GUARD_MSG', 'cmd': 'GUARD_MSG', 'msg': ':?国产达闻西:? 在本房间开通了舰长' },
    {id: 'GUARD_BUY3', 'cmd': 'GUARD_BUY', 'data': { 'uid': 55504332, 'username': '雪之下雪乃の八幡', 'guard_level': 3, 'num': 1, 'price': 198000, 'role_name': 10003, 'gift_name': '舰长', 'start_time': 1588949036, 'end_time': 1588949036 } },
    {id: 'GUARD_BUY2', 'cmd': 'GUARD_BUY', 'data': { 'uid': 55504332, 'username': '雪之下雪乃の八幡', 'guard_level': 2, 'num': 1, 'price': 198000, 'role_name': 10003, 'gift_name': '提督', 'start_time': 1588949036, 'end_time': 1588949036 } },
    {id: 'GUARD_BUY1', 'cmd': 'GUARD_BUY', 'data': { 'uid': 55504332, 'username': '雪之下雪乃の八幡', 'guard_level': 1, 'num': 1, 'price': 198000, 'role_name': 10003, 'gift_name': '总督', 'start_time': 1588949036, 'end_time': 1588949036 } },
    {id: 'GUARD_LOTTERY_START', 'cmd': 'GUARD_LOTTERY_START', 'data': { 'id': 2461426, 'link': 'https://live.bilibili.com/14327465', 'lottery': { 'asset_animation_pic': 'https://i0.hdslb.com/bfs/vc/ff2a28492970850ce73df0cc144f1766b222d471.gif', 'asset_icon': 'https://i0.hdslb.com/bfs/vc/43f488e7c4dca5ba6fbdcb88f40052d56bf777d8.png', 'id': 2461426, 'keyword': 'guard', 'mobile_animation_asset': '', 'mobile_display_mode': 2, 'mobile_static_asset': '', 'privilege_type': 3, 'sender': { 'face': 'http://i1.hdslb.com/bfs/face/7b273d356f7823067c7deaf32a097ddbe7019c7e.jpg', 'uid': 67929023, 'uname': '国产达闻西' }, 'status': 1, 'thank_text': '恭喜<%国产达闻西%>上任舰长', 'time': 1200, 'time_wait': 0, 'weight': 0 }, 'payflow_id': '2005072308160482190233750', 'privilege_type': 3, 'roomid': 14327465, 'type': 'guard' } },
    {id: 'ROOM_BLOCK_MSG', "cmd": "ROOM_BLOCK_MSG", "uid": "208259", "uname": "陈睿", "data": { "uid": 208259, "uname": "陈睿", "operator": 208259 }},
    {id: 'WARNING', "cmd":"WARNING","msg":"因版权原因，请立即更换"},
    {id: 'CUT_OFF', "cmd":"CUT_OFF","msg":"违反直播规范"},
  ];

  const getMsgItem = async (id: string) => {
    const msg = lists.filter(i => i.id === id);
    const res = await parseData(msg[0]);
    return [res];
  };

  return (
    <div className="danmakuActionMenu">
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('DANMU_MSG'))}>普通文字弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('DANMU_MSG3'))}>舰长文字弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('DANMU_MSG2'))}>提督文字弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('DANMU_MSG1'))}>总督文字弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('SEND_GIFT1'))}>礼物弹幕测试(银瓜子)</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('SEND_GIFT2'))}>礼物弹幕测试1(金瓜子)</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage( await getMsgItem('SEND_GIFT3'))}>礼物弹幕测试2(金瓜子)</span>
      {/*<span className="danmakuActionMenuItem pointer">高级礼物弹幕测试</span>*/}
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('COMBO_SEND'))}>礼物连击测试send</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('COMBO_END'))}>礼物连击测试end</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('WELCOME_GUARD'))}>欢迎舰长进入弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('INTERACT_WORD'))}>用户进入弹幕测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('ROOM_REAL_TIME_MESSAGE_UPDATE'))}>直播间信息更新测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('SUPER_CHAT_MESSAGE1'))}>SC测试1</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('SUPER_CHAT_MESSAGE2'))}>SC测试2</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('GUARD_BUY3'))}>购买舰长测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('GUARD_BUY2'))}>购买提督测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('GUARD_BUY1'))}>购买总督测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('ROOM_BLOCK_MSG'))}>用户禁言测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('WARNING'))}>警告测试</span>
      <span className="danmakuActionMenuItem pointer" onClick={async () => onMessage(await getMsgItem('CUT_OFF'))}>切断测试</span>
    </div>
  );
}

function SettingFontFamily(props: {
  handleUpdateConfig: HandleUpdateConfigFunc;
}) {
  const { handleUpdateConfig } = props;
  const config = useAppSelector(selectConfig);
  const systemFontsLists = ['lolita', ...systemFonts];

  const onSelect = ({ key }) => {
    handleUpdateConfig(ConfigKey.fontFamily, key);
  };

  const fontFamilyMenu = (
    <Menu onSelect={onSelect} className="fontFamilyMenuContainer">
      {systemFontsLists.map((font) => (
        <MenuItem key={font} style={{ fontFamily: font }}>{font}</MenuItem>
      ))}
    </Menu>
  );

  return (
    <Dropdown trigger={ ["click"] }
              overlay={ fontFamilyMenu }
              animation="slide-up">
      <span className="action-text cursor">
        { config.fontFamily }
        <span role="img" aria-label="down" className="action action-down">
          <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true" > <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" /> </svg>
        </span>
      </span>
    </Dropdown>
  )
}

function SettingContent(props: {
  handleUpdateConfig: HandleUpdateConfigFunc;
  handleDispatchResetConfig: () => void;
}) {
  const { handleUpdateConfig, handleDispatchResetConfig } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  return (
    <div className="container">
      <h1 className="title">{t('GlobalSettingTitle')}</h1>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('LanguageTip')}</span>
        <LanguagePanel {...props} configKey={'languageCode'} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('fontFamily')}</span>
        <SettingFontFamily handleUpdateConfig={handleUpdateConfig} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('GlobalSettingShowAvatar')}</span>
        <Switch status={config.showAvatar} onChange={v => handleUpdateConfig(ConfigKey.showAvatar, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('GlobalSettingShowFanLabel')}</span>
        <Switch status={config.showFanLabel} onChange={v => handleUpdateConfig(ConfigKey.showFanLabel, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('GlobalSettingShowLvLabel')}</span>
        <Switch status={config.showLvLabel} onChange={v => handleUpdateConfig(ConfigKey.showLvLabel, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('GlobalSettingShowVip')}</span>
        <Switch status={config.showVip} onChange={v => handleUpdateConfig(ConfigKey.showVip, v)} />
      </div>
      <h1 className="title title-sub">{t('DanmakuSettingTitle')}</h1>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('DanmakuSettingMaxMessageCount')}</span>
        <input type="text"
               defaultValue={config.maxMessageCount}
               onBlur={(e) => handleUpdateConfig(ConfigKey.maxMessageCount, Number(e.target.value))}
               className="link-input t-center v-middle border-box level-input" />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('DanmakuSettingMaxGiftCount')}</span>
        <input type="text"
               defaultValue={config.maxDanmakuGiftCount}
               onBlur={(e) => handleUpdateConfig(ConfigKey.maxDanmakuGiftCount, Number(e.target.value))}
               className="link-input t-center v-middle border-box level-input" />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('DanmakuSettingBlockMinGoldSeed')}</span>
        <input type="text"
               defaultValue={config.blockMinGoldSeed}
               onBlur={(e) => handleUpdateConfig(ConfigKey.blockMinGoldSeed, Number(e.target.value))}
               className="link-input t-center v-middle border-box level-input" />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('DanmakuSettingBlockMinSilverSeed')}</span>
        <input type="text"
               defaultValue={config.blockMinSilverSeed}
               onBlur={(e) => handleUpdateConfig(ConfigKey.blockMinSilverSeed, Number(e.target.value))}
               className="link-input t-center v-middle border-box level-input" />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('ShowGiftDanmakuList')}</span>
        <Switch status={config.showGiftDanmakuList} onChange={v => handleUpdateConfig(ConfigKey.showGiftDanmakuList, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('DanmakuSettingShowTransition')}</span>
        <Switch status={config.showTransition} onChange={v => handleUpdateConfig(ConfigKey.showTransition, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('BackgroundColorTitle')}（{config.backgroundColor === 0 ? t('BackgroundColorWhite') : t('BackgroundColorBlack')}）</span>
        <Switch status={config.backgroundColor} onChange={v => handleUpdateConfig(ConfigKey.backgroundColor, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('BackgroundOpacity')}</span>
        <div className="link-range-ctnr">
          <Slider value={toPercentNum(config.backgroundOpacity)}
                  min={0}
                  max={100}
                  step={2}
                  onChange={v => handleUpdateConfig(ConfigKey.backgroundOpacity, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{toPercentNum(config.backgroundOpacity)}%</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('AvatarSize')}</span>
        <div className="link-range-ctnr">
          <Slider value={config.avatarSize}
                  min={16}
                  max={50}
                  step={2}
                  onChange={v => handleUpdateConfig(ConfigKey.avatarSize, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{config.avatarSize}px</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('FontSize')}</span>
        <div className="link-range-ctnr">
          <Slider value={config.fontSize} step={1} min={10} max={50} onChange={v => handleUpdateConfig(ConfigKey.fontSize, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{config.fontSize}px</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('FontLineHeight')}</span>
        <div className="link-range-ctnr">
          <Slider value={config.fontLineHeight} step={1} min={0} max={50} onChange={v => handleUpdateConfig(ConfigKey.fontLineHeight, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{config.fontLineHeight}px</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('FontMarginTop')}</span>
        <div className="link-range-ctnr">
          <Slider value={config.fontMarginTop} step={1} min={0} max={30} onChange={v => handleUpdateConfig(ConfigKey.fontMarginTop, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{config.fontMarginTop}px</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('ResetConfig')} <span onClick={() => handleDispatchResetConfig()} className="icon-font icon-item icon-replace icon-config-reset" /></span>
      </div>
      <CustomStyledPanel />
    </div>
  );
}

function TranslateSetting(props: {
  handleUpdateConfig: HandleUpdateConfigFunc;
}) {
  const { handleUpdateConfig } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  return (
    <div className="container">
      <h1 className="title">{t('TranslateSettingTitle')}</h1>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('AutoTranslate')}</span>
        <Switch status={config.autoTranslate} onChange={v => handleUpdateConfig(ConfigKey.autoTranslate, v)} disabled />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('TranslateFrom')}</span>
        <span>{t('TranslateFromAuto')}</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('TranslateTo')}</span>
        <LanguagePanel {...props} configKey={'translateTo'} />
      </div>
      <h1 className="title title-sub">{t('VoiceSettingTitle')}</h1>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('VoiceSettingShowVoice')}</span>
        <Switch status={config.showVoice} onChange={v => handleUpdateConfig(ConfigKey.showVoice, v)} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('TtsEngine')}</span>
        <TtsPanel {...props} configKey={'ttsEngine'} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('EdgeTTSVoice')}</span>
        <TtsPanel {...props} configKey={'edgeTTSVoice'} />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('TranslateFrom')}</span>
        <span>{t('TranslateFromAuto')}</span>
      </div>
      {/*<div className="danmaku-adjust-row">*/}
      {/*  <span className="danmaku-adjust-label v-middle dp-i-block">{t('VoiceTranslateTo')}</span>*/}
      {/*  <LanguagePanel {...props} configKey={'voiceTranslateTo'} />*/}
      {/*</div>*/}
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('VoiceSettingTaskMaxLength')}</span>
        <input type="text"
               defaultValue={config.taskMaxLength}
               onBlur={(e) => handleUpdateConfig(ConfigKey.taskMaxLength, Number(e.target.value))}
               className="link-input t-center v-middle border-box level-input" />
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('VoiceSettingVolume')}</span>
        <div className="link-range-ctnr">
          <Slider value={toPercentNum(config.voiceVolume)} onChange={v => handleUpdateConfig(ConfigKey.voiceVolume, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{ toPercentNum(config.voiceVolume) }%</span>
      </div>
      <div className="danmaku-adjust-row">
        <span className="danmaku-adjust-label v-middle dp-i-block">{t('VoiceSettingVoiceSpeed')}</span>
        <div className="link-range-ctnr">
          <Slider value={toPercentNum(config.voiceSpeed)} onChange={v => handleUpdateConfig(ConfigKey.voiceSpeed, v)} />
        </div>
        <span className="danmaku-adjust-value dp-i-block">{toPercentNum(config.voiceSpeed)}%</span>
      </div>
    </div>
  )
}

function EffectBlock(props: {
  clearSCMessage: () => void;
  handleUpdateConfig: HandleUpdateConfigFunc;
}) {
  const { clearSCMessage, handleUpdateConfig } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  return (
    <div className="block-effect-ctnr h-100 border-box p-relative">
      <h1 className="title">{t('BlockEffectTitle')}</h1>
      <ul className="list danmaku-adjust-row">
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem0)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem0 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-0" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem0')}</label>
        </li>
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem1)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem1 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-1" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem1')}</label>
        </li>
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem2)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem2 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-2" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem2')}</label>
        </li>
        <li onClick={() => { clearSCMessage(); handleUpdateConfig(ConfigKey.blockEffectItem3)}} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem3 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-3" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem3')}</label>
        </li>
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem4)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem4 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-4" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem4')}</label>
        </li>
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem5)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem5 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-4" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem5')}</label>
        </li>
        <li onClick={() => handleUpdateConfig(ConfigKey.blockEffectItem6)} className="item">
          <span className={`cb-icon svg-icon v-middle p-absolute checkbox-${config.blockEffectItem6 ? 'selected' : 'default'}`} />
          <input id="block-effect-item-4" type="checkbox" className="pointer v-middle" />
          <label className="pointer dp-i-block v-middle block-effect-item">{t('BlockEffectItem6')}</label>
        </li>
      </ul>
    </div>
  );
}

function DanmakuBlock(props: {
  handleUpdateConfig: HandleUpdateConfigFunc;
}) {
  const { handleUpdateConfig } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);
  let { blockDanmakuLists, blockUserLists } = config;
  let [blockKeyWord, setBlockKeyWord] = useState('');
  let [blockTab, setBlockTab] = useState(0);
  let [selectedList, setSelectedList] = useState([]);

  let blockList = blockTab === 0 ? blockDanmakuLists : blockUserLists;
  const blockUserNotMember = config.blockUserNotMember === 1;
  const blockUserNotBindPhone = config.blockUserNotBindPhone === 1;

  // 屏蔽对应弹幕文字
  const addBlockDanmaku = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    if (!blockKeyWord) return;
    blockDanmakuLists.push(blockKeyWord);
    blockDanmakuLists = Array.from(new Set(blockDanmakuLists));
    handleUpdateConfig(ConfigKey.blockDanmakuLists, blockDanmakuLists);
    setBlockKeyWord('');
  };

  const changeBlockTab = (tabIndex: number) => {
    if (blockTab === tabIndex) return;
    setSelectedList([]);
    setBlockTab(tabIndex);
  };

  const addSelectedList = (item: string | number) => {
    if (selectedList.includes(item)) {
      const index = selectedList.findIndex(i => i === item);
      if (index === -1) return;
      selectedList.splice(index, 1);
    } else {
      selectedList.push(item);
    }
    setSelectedList([...selectedList]);
  };

  const selectAll = () => {
    if (blockList.length === selectedList.length) {
      setSelectedList([]);
    } else {
      setSelectedList(blockList);
    }
  };

  const isSelectedAll = () => {
    if (blockList.length === 0) return false;
    return selectedList.length === blockList.length;
  };

  const deleteBlockItem = () => {
    const blockListDiff = arrayDiff(blockList, selectedList);
    if (blockTab === 0) {
      handleUpdateConfig(ConfigKey.blockDanmakuLists, blockListDiff);
    } else {
      handleUpdateConfig(ConfigKey.blockUserLists, blockListDiff);
    }
    setSelectedList([]);
  };

  return (
    <div className="block-setting-ctnr">
      <div>
        <h1 className="title">{t('GlobalBlockModeTitle')}</h1>
        <div className="block-setting-row">
          <span className="setting-label">{t('GlobalBlockModeHasBeen')}{config.blockMode === 1 ? t('GlobalBlockModeOn') : t('GlobalBlockModeOff')}</span>
          <Switch status={config.blockMode} onChange={v => handleUpdateConfig(ConfigKey.blockMode, v)} />
        </div>
        <div className="block-setting-row">
          <span className="setting-label">{t('GlobalBlockUserLv')}</span>
          <div className="link-range-ctnr" style={{width: 96}}>
            <Slider min={0} max={60} step={1} value={config.blockUserLv} onChange={v => handleUpdateConfig(ConfigKey.blockUserLv, v)} />
          </div>
          <input type="text"
                 value={config.blockUserLv || 0}
                 onChange={e => handleUpdateConfig(ConfigKey.blockUserLv, e.target.value)}
                 className="link-input t-center v-middle border-box level-input" />
          <span className="v-middle level-hint-text">{t('GlobalBlockUserLvUnder')}</span>
        </div>
        <div className="block-setting-row">
          <div onClick={() => handleUpdateConfig(ConfigKey.blockUserNotMember, blockUserNotMember ? 0 : 1)}
               className={`block-user-type v-top dp-i-block p-relative ${ blockUserNotMember ? 'active' : '' }`}>
            <div className="user-type-icon p-relative">
              <span className={`svg-icon not-member-${ blockUserNotMember ? 1 : 2 }`} />
              {
                blockUserNotMember && (
                  <div className="close-icon p-absolute">
                    <span className="close-icon-bar dp-i-block p-absolute" />
                  </div>
                )
              }
            </div>
            <span className="user-type-hint">{t('GlobalBlockUserNotMember')}</span>
          </div>
          <div onClick={() => handleUpdateConfig(ConfigKey.blockUserNotBindPhone, blockUserNotBindPhone ? 0 : 1)}
               className={ `block-user-type v-top dp-i-block ${ blockUserNotBindPhone ? 'active' : '' }` }>
            <div className="user-type-icon p-relative">
              <span className={ `svg-icon phone-${ blockUserNotBindPhone ? '1' : '2' }` }/>
              {
                blockUserNotBindPhone && (
                  <div className="close-icon p-absolute">
                    <span className="close-icon-bar dp-i-block p-absolute" />
                  </div>
                )
              }
            </div>
            <span className="user-type-hint">{t('GlobalBlockUserNotBindPhone')}</span>
          </div>
        </div>
      </div>
      <h1 className="title" style={{ marginTop: 16 }}>{t('GlobalBlockKeyWordTitle')}</h1>
      <form onSubmit={addBlockDanmaku} className="block-setting-row">
        <input type="text"
               value={blockKeyWord}
               onChange={e => setBlockKeyWord(e.target.value)}
               placeholder={t('GlobalBlockKeyWordPlaceHolder')}
               maxLength="15"
               className="link-input border-box keyword-input v-middle"
               style={{ width: 178, height: 24 }} />
        <button disabled={!blockKeyWord}
                onClick={addBlockDanmaku}
                className="bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small">
          <span className="txt">{t('GlobalBlockKeyWordAdd')}</span>
        </button>
      </form>
      <h2 className="sub-title">{t('GlobalBlockListsTitle')}</h2>
      <div className="list-options-ctnr p-relative">
        <span className={`list-content-candidate dp-i-block divider ${blockTab === 0 ? 'active' : ''}`} onClick={() => changeBlockTab(0)}>{t('GlobalBlockKeyWordLists')}</span>
        <span className={`list-content-candidate dp-i-block ${blockTab === 1 ? 'active' : ''}`} onClick={() => changeBlockTab(1)}>{t('GlobalBlockUserLists')}</span></div>
      <ul className="block-list-ctnr ps ps--theme_default scrollbar">
        {
          blockList.map((item, index) => {
            return (
              <li className="block-list-row" onClick={() => addSelectedList(item)} key={`blockDanmakuLists_${index}`}>
                <span className={`check-icon svg-icon v-middle ${isInclude(item, selectedList) ? 'checkbox-selected' : 'checkbox-default'}`} />
                <span className="block-content v-middle">{item}</span>
              </li>
            )
          })
        }
        <div className="ps__scrollbar-x-rail" style={{ left: 0, bottom: 0 }}>
          <div className="ps__scrollbar-x" style={{ left: 0, width: 0 }} />
        </div>
        <div className="ps__scrollbar-y-rail" style={{ left: 0, right: 0 }}>
          <div className="ps__scrollbar-y" style={{ top: 0, height: 0 }} />
        </div>
      </ul>
      <div className="bottom-action-row p-relative">
        <div className="select-all-ctnr cursor-default" onClick={selectAll}>
          <span className={`check-icon svg-icon v-middle ${isSelectedAll() ? 'checkbox-selected' : 'checkbox-default'}`} />
          <span className="block-content v-middle">{t('GlobalBlockCheck')}</span>
        </div>
        {
          selectedList.length !== 0 && (
            <button className="bl-button del-btn bl-button--ghost bl-button--small" onClick={deleteBlockItem} style={{height: 20}}>
              <span className="txt">{t('GlobalBlockDelete')}</span>
            </button>
          )
        }
      </div>
    </div>
  );
}

function About(props: {
  newVersion: boolean;
}) {
  const { newVersion } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  return (
    <div className="aboutContainer">
      <h1 className="title">{t('AboutTitle')}</h1>
      <div onClick={() => openLink(`https://github.com/Beats0/bilive-danmaku`)} className="cursor danmaku-adjust-row2">
        <span className="danmaku-adjust-label-about v-middle dp-i-block">{t('AboutSourceCode')}</span>
        <span>GitHub</span>
      </div>
      <div className="danmaku-adjust-row2">
        <span className="danmaku-adjust-label-about v-middle dp-i-block">{t('CurrentVersion')}</span>
        <span>V{config.version}</span>
      </div>
      <div onClick={() => openLink(`https://github.com/Beats0/bilive-danmaku/releases`)} className="cursor danmaku-adjust-row2 version">
        <span className="danmaku-adjust-label-about v-middle dp-i-block">{t('LatestVersion')}</span>
        <span>V{config.latestVersion}</span>
        {newVersion && <span className="versionDot" />}
      </div>
      <div onClick={() => openLink(`https://github.com/Beats0`)} className="cursor danmaku-adjust-row2">
        <span className="danmaku-adjust-label-about v-middle dp-i-block">{t('Author')}</span>
        <span>Beats0</span>
      </div>
      <div onClick={() => openLink(`https://github.com/Beats0/bilive-danmaku/blob/master/LICENSE`)} className="cursor danmaku-adjust-row2">
        <span className="danmaku-adjust-label-about v-middle dp-i-block">Licence</span>
        <span>MIT</span>
      </div>
    </div>
  );
}

export default DanmakuControl;
