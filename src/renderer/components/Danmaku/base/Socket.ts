/**
 * @author LeeeeeeM https://github.com/LeeeeeeM/bilibili-web-socket
 * @author Beats0 https://github.com/Beats0
 * 参考了LeeeeeeM的设计模式和弹幕解释器，写到一半了结果官方socket采用了zlib压缩导致以前的解释器解析失败 = =
 * 翻了翻B站的js代码，一步一步断点逆向，调试了两天，终于搞到了解释器convertToObject
 * convertToObject是被压缩后的代码格式，鬼知道以后会不会又被改，直接用就行
 * */

/* eslint-disable no-underscore-dangle */
import pako from 'pako';
import wsUrl from '../common/ws-url';
import msgStruct from '../common/msg-struct';
import { generatePacket } from '../../../utils/packet';
// import { bytes2str } from '../../../utils/convert';
import { CmdType, parseData } from '../MsgModel';
import config from '../../../config';

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
  '-6': 'incompatible version'
};
const defaultUid = 598848;

export default class Socket {
  private readonly roomid: number;

  private readonly uid: number;

  private _docker: WebSocket;

  public _methods: Function[];

  private i: {
    a: {
      WS_BODY_PROTOCOL_VERSION_NORMAL: number;
      WS_OP_CONNECT_SUCCESS: number;
      WS_AUTH_OK: number;
      WS_BODY_PROTOCOL_VERSION_DEFLATE: number;
      WS_VERSION_OFFSET: number;
      WS_PACKAGE_HEADER_TOTAL_LENGTH: number;
      WS_HEADER_DEFAULT_SEQUENCE: number;
      WS_OPERATION_OFFSET: number;
      WS_SEQUENCE_OFFSET: number;
      WS_HEADER_DEFAULT_VERSION: number;
      WS_OP_HEARTBEAT: number;
      WS_AUTH_TOKEN_ERROR: number;
      WS_OP_HEARTBEAT_REPLY: number;
      WS_OP_MESSAGE: number;
      WS_OP_USER_AUTHENTICATION: number;
      WS_HEADER_OFFSET: number;
      WS_HEADER_DEFAULT_OPERATION: number;
      WS_PACKAGE_OFFSET: number;
    };
    getDecoder: TextDecoder;
  };

  constructor(roomid: number, uid = defaultUid) {
    this.roomid = roomid;
    this.uid = uid;
    this._docker = new WebSocket(wsUrl);
    this._methods = [];
    this.i = {
      a: {
        WS_AUTH_OK: 0,
        WS_AUTH_TOKEN_ERROR: -101,
        WS_BODY_PROTOCOL_VERSION_DEFLATE: 2,
        WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
        WS_HEADER_DEFAULT_OPERATION: 1,
        WS_HEADER_DEFAULT_SEQUENCE: 1,
        WS_HEADER_DEFAULT_VERSION: 1,
        WS_HEADER_OFFSET: 4,
        WS_OPERATION_OFFSET: 8,
        WS_OP_CONNECT_SUCCESS: 8,
        WS_OP_HEARTBEAT: 2,
        WS_OP_HEARTBEAT_REPLY: 3,
        WS_OP_MESSAGE: 5,
        WS_OP_USER_AUTHENTICATION: 7,
        WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
        WS_PACKAGE_OFFSET: 0,
        WS_SEQUENCE_OFFSET: 12,
        WS_VERSION_OFFSET: 6
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
              }
            };
      }
    };
  }

  public async init() {
    console.log(`新的socket：[${this.roomid}] 正在初始化...`);
    this._docker.binaryType = 'arraybuffer';
    this._docker.onopen = event => {
      const msg = {
        cmd: 'CONNECT_SUCCESS'
      }
      this._call([msg]);
      const join = this._joinRoom(this.roomid, this.uid);
      this._docker.send(join.buffer);
      this._sendBeat();
    };
    this._docker.onmessage = event => {
      this._dockeronMessage(event);
    };
    this._docker.onclose = event => {
      const msg = {
        cmd: CmdType.DISCONNECTED
      };
      this._call([msg]);
      console.log(`旧的socket已经关闭...`);
    };
  }

  /**
   * 官方版
   public onMessage(e) {
    const t = this;
    const { i } = t;
    try {
      const n = this.convertToObject(e.data);
      if (n instanceof Array)
        n.forEach(function(e) {
          t.onMessage(e);
        });
      else if (n instanceof Object)
        switch (n.op) {
          case i.a.WS_OP_HEARTBEAT_REPLY:
            // this.onHeartBeatReply(n.body);
            break;
          case i.a.WS_OP_MESSAGE:
            // this.onMessageReply(n.body);
            break;
          case i.a.WS_OP_CONNECT_SUCCESS:
            if (0 !== n.body.length && n.body[0])
                switch (n.body[0].code) {
                case i.a.WS_AUTH_OK:
                    this.heartBeat();
                    break;
                case i.a.WS_AUTH_TOKEN_ERROR:
                    this.options.retry = !1,
                    "function" == typeof this.options.onReceiveAuthRes && this.options.onReceiveAuthRes(n.body);
                    break;
                default:
                    this.onClose()
                }
            else
                this.heartBeat()
            break;
        }
    } catch (e) {
      console.error('WebSocket Error: ', e);
    }
    return this;
  }
  */

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

  private o(e) {
    const n = new pako.Inflate();
    if ((n.push(e, !0), n.err)) throw n.msg || l[n.err];
    return n.result;
  }

  private convertToObject(e) {
    const { i } = this;
    const t = new DataView(e);
    const n = {
      body: []
    };
    if (
      ((n.packetLen = t.getInt32(i.a.WS_PACKAGE_OFFSET)),
      msgStruct.forEach(function(e) {
        e.bytes === 4
          ? (n[e.key] = t.getInt32(e.offset))
          : e.bytes === 2 && (n[e.key] = t.getInt16(e.offset));
      }),
      n.packetLen < e.byteLength &&
        this.convertToObject(e.slice(0, n.packetLen)),
      this.decoder || (this.decoder = i.getDecoder()),
      !n.op ||
        (i.a.WS_OP_MESSAGE !== n.op && n.op !== i.a.WS_OP_CONNECT_SUCCESS))
    )
      n.op &&
        i.a.WS_OP_HEARTBEAT_REPLY === n.op &&
        (n.body = {
          count: t.getInt32(i.a.WS_PACKAGE_HEADER_TOTAL_LENGTH)
        });
    else
      for (
        let r = i.a.WS_PACKAGE_OFFSET, s = n.packetLen, u = '', l = '';
        r < e.byteLength;
        r += s
      ) {
        (s = t.getInt32(r)), (u = t.getInt16(r + i.a.WS_HEADER_OFFSET));
        try {
          if (n.ver === i.a.WS_BODY_PROTOCOL_VERSION_DEFLATE) {
            const c = e.slice(r + u, r + s);
            const d = this.o(new Uint8Array(c));
            l = this.convertToObject(d.buffer).body;
          } else {
            const f = this.decoder.decode(e.slice(r + u, r + s));
            l = f.length !== 0 ? JSON.parse(f) : null;
          }
          l && n.body.push(l);
        } catch (t) {
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
  private _joinRoom(roomid, uid) {
    const packet = JSON.stringify({
      uid,
      roomid
    });
    return generatePacket(7, packet);
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
    config.blockDanmakuLists.some(b => info['1'].indexOf(b) !== -1) ||
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
