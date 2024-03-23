/* eslint-disable no-underscore-dangle */
import { BrotliDecode } from '../../../utils/brotli';
import wsUrl from '../common/ws-url';
import msgStruct from '../common/msg-struct';
import { generatePacket } from '../../../utils/packet';
// import { bytes2str } from '../../../utils/convert';
import { CmdType, parseData } from '../MsgModel';
import config from '../../../config';
import { getBuvid3, getDanmuInfoData } from '../../../api';
import UserInfoDao, { UserInfoDaoNS } from '../../../dao/UesrInfoDao';

export interface SocketInstanceType {
  roomid: number;
  uid: number;
  _methods: Function[];
  init: () => void;
  close: () => void;
  addMethods: (fns: Function[]) => void;
}

const l = {
  '0': '',
  '1': 'stream end',
  '2': 'need dictionary',
  '-1': 'file error',
  '-2': 'stream error',
  '-3': 'data error',
  '-4': 'insufficient memory',
  '-5': 'buffer error',
  '-6': 'incompatible version',
};

const defaultUid = 0;

export default class Socket {
  private roomid: number;

  private uid: number;

  private _docker: WebSocket;

  public _methods: Function[];

  private i: {
    a: {
      [key: string]: number;
    };
    getDecoder: TextDecoder;
  };

  constructor(roomid: number) {
    this.roomid = roomid;
    this.uid = defaultUid;
    this._docker = new WebSocket(wsUrl);
    this._methods = [];
    this.i = {
      a: {
        WS_OP_HEARTBEAT: 2,
        WS_OP_HEARTBEAT_REPLY: 3,
        WS_OP_MESSAGE: 5,
        WS_OP_USER_AUTHENTICATION: 7,
        WS_OP_CONNECT_SUCCESS: 8,
        WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
        WS_PACKAGE_OFFSET: 0,
        WS_HEADER_OFFSET: 4,
        WS_VERSION_OFFSET: 6,
        WS_OPERATION_OFFSET: 8,
        WS_SEQUENCE_OFFSET: 12,
        WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
        WS_BODY_PROTOCOL_VERSION_BROTLI: 3,
        WS_HEADER_DEFAULT_VERSION: 1,
        WS_HEADER_DEFAULT_OPERATION: 1,
        WS_HEADER_DEFAULT_SEQUENCE: 1,
        WS_AUTH_OK: 0,
        WS_AUTH_TOKEN_ERROR: -101,
      },
      getDecoder() {
        return window.TextDecoder
          ? new window.TextDecoder()
          : {
              decode(e) {
                return decodeURIComponent(
                  window.escape(
                    String.fromCharCode.apply(String, new Uint8Array(e))
                  )
                );
              },
            };
      },
    };
  }

  public async init() {
    let uid: number;
    const userInfoUidStr = UserInfoDao.get(UserInfoDaoNS.UserInfoUid);
    const userInfoSessionStr = UserInfoDao.get(UserInfoDaoNS.UserInfoSession);
    if (userInfoUidStr && userInfoSessionStr) {
      uid = Number(userInfoUidStr) || 0;
    } else {
      uid = defaultUid;
    }
    this.uid = uid;
    console.log(`新的socket：[${this.roomid}] 正在初始化...`);
    this._docker.binaryType = 'arraybuffer';
    this._docker.onopen = async (event) => {
      const msg = {
        cmd: 'CONNECT_SUCCESS',
      };
      this._call([msg]);
      const join = await this._joinRoom(this.roomid, this.uid);
      this._docker.send(join.buffer);
      this._sendBeat();
    };
    this._docker.onmessage = (event) => {
      this._dockeronMessage(event);
    };
    this._docker.onclose = (event) => {
      const msg = {
        cmd: CmdType.DISCONNECTED,
      };
      this._call([msg]);
      console.log(`旧的socket已经关闭...`);
    };
  }

  private async _dockeronMessage(event) {
    // this.onMessage(event);
    const n: { op: number; body: DanmakuData[] } = this.convertToObject(
      event.data
    );
    const resultArr = [];
    const contentArr: string[] = [];
    const repeat = {};
    if (n.op === 3) {
      const msg = { cmd: CmdType.POPULAR, popular: n.body.count || 1 };
      resultArr.push(msg);
    } else if (n.op === 5) {
      const body = n.body ? n.body[0] : [];
      for (let i = 0; i < body.length; i++) {
        const d = body[i];
        // 弹幕过滤
        // console.log('d.cmd', d.cmd, d)
        if (d.cmd === CmdType.DANMU_MSG) {
          if (!danmakuFilter(d.info)) {
            const content = d.info['1'] || '';
            if (contentArr.includes(content)) {
              repeat[content] += 1;
            } else {
              repeat[content] = 0;
              contentArr.push(content);
              // 添加一次非重复弹幕消息
              const p = await parseData(d);
              resultArr.push(p);
            }
          }
        } else {
          // 添加其他所有消息
          const p = await parseData(d);
          resultArr.push(p);
        }
      }
    }
    // 计算danmu_msg弹幕重复率
    for (let i = 0; i < resultArr.length; i++) {
      const msg = resultArr[i];
      if (msg.cmd === CmdType.DANMU_MSG) {
        const { content } = msg;
        resultArr[i].repeat = repeat[content];
      }
    }
    this._call(resultArr);
  }

  private convertToObject(e) {
    const r = this.i;
    const t = new DataView(e);
    const n = {
      body: [],
    };
    if (
      ((n.packetLen = t.getInt32(r.a.WS_PACKAGE_OFFSET)),
      msgStruct.forEach(function (e) {
        e.bytes === 4
          ? (n[e.key] = t.getInt32(e.offset))
          : e.bytes === 2 && (n[e.key] = t.getInt16(e.offset));
      }),
      n.packetLen < e.byteLength &&
        this.convertToObject(e.slice(0, n.packetLen)),
      this.decoder || (this.decoder = r.getDecoder()),
      !n.op ||
        (r.a.WS_OP_MESSAGE !== n.op && n.op !== r.a.WS_OP_CONNECT_SUCCESS))
    )
      n.op &&
        r.a.WS_OP_HEARTBEAT_REPLY === n.op &&
        (n.body = {
          count: t.getInt32(r.a.WS_PACKAGE_HEADER_TOTAL_LENGTH),
        });
    else
      for (
        let i = r.a.WS_PACKAGE_OFFSET, o = n.packetLen, s = '', l = '';
        i < e.byteLength;
        i += o
      ) {
        (o = t.getInt32(i)), (s = t.getInt16(i + r.a.WS_HEADER_OFFSET));
        try {
          if (n.ver === r.a.WS_BODY_PROTOCOL_VERSION_NORMAL) {
            const c = this.decoder.decode(e.slice(i + s, i + o));
            l = c.length !== 0 ? JSON.parse(c) : null;
          } else if (n.ver === r.a.WS_BODY_PROTOCOL_VERSION_BROTLI) {
            const u = e.slice(i + s, i + o);
            const d = BrotliDecode(new Uint8Array(u));
            l = this.convertToObject(d.buffer).body;
          }
          l && n.body.push(l);
        } catch (t) {
          // this.options.onLogger("decode body error:", new Uint8Array(e), n, t)
          console.error('decode body error:', new Uint8Array(e), n, t);
        }
      }
    return n;
  }

  public addMethods(fns) {
    this._methods = fns;
  }

  public close() {
    // 清除定时脚本
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._docker.close();
  }

  private _call(...args) {
    for (let i = 0, l = this._methods.length; i < l; i++) {
      const fn = this._methods[i];
      if (typeof fn !== 'function') continue;
      fn.apply(null, args);
    }
  }

  // 发送加入房间包
  private async _joinRoom(roomid: number, uid: number) {
    const buvid = await getBuvid3();
    const danmuInfoData = await getDanmuInfoData(roomid);
    const packet = {
      uid,
      roomid,
      protover: 3,
      platform: 'web',
      type: 2,
      buvid,
      key: danmuInfoData ? danmuInfoData.token : '',
    };
    return generatePacket(
      this.i.a.WS_OP_USER_AUTHENTICATION,
      JSON.stringify(packet)
    );
  }

  // 发送心跳包，表明连接激活
  private _sendBeat() {
    this._timer = setInterval(() => {
      this._docker.send(generatePacket());
    }, 30 * 1000);
  }
}

// 弹幕过滤
function danmakuFilter(info: DANMU_MSG_Info): boolean {
  // 抽奖弹幕过滤
  if (config.blockEffectItem1 === 1 && info['0']['9'] === 2) return true;
  if (config.blockMode === 0) return false;
  const userLv = info['4']['0'] || 0;
  // 弹幕关键字，屏蔽uid名单过滤
  if (
    config.blockDanmakuLists.some((b) => info['1'].indexOf(b) !== -1) ||
    config.blockUserLists.includes(info['2']['0'])
  )
    return true;
  // 据用户等级过滤
  if (userLv <= config.blockUserLv) return true;
  // 正式会员过滤
  if (config.blockUserNotMember === 1 && info['2']['5'] !== 10000) return true;
  // 绑定手机过滤
  if (config.blockUserNotBindPhone === 1 && info['2']['6'] !== 1) return true;
  return false;
}
