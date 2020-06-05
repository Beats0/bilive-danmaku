import { str2bytes } from './convert';

/**
 * 生成对应的消息包
 * @param {Number} action 2是心跳包/7是加入房间
 * @param {String} payload
 */
function generatePacket(action = 2, payload = ''): DataView {
  const packet = str2bytes(payload);
  const buff = new ArrayBuffer(packet.length + 16);
  const dataBuf = new DataView(buff);
  dataBuf.setUint32(0, packet.length + 16);
  dataBuf.setUint16(4, 16);
  dataBuf.setUint16(6, 1);
  dataBuf.setUint32(8, action);
  dataBuf.setUint32(12, 1);
  for (let i = 0; i < packet.length; i++) {
    dataBuf.setUint8(16 + i, packet[i]);
  }
  return dataBuf;
}

export { generatePacket };
