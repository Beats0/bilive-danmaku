/**
 * 各个帧结构所需要的字段，待拓展
 */

const messageStruct = [
  {
    name: 'Header Length', // 帧头
    key: 'headerLen',
    bytes: 2, // 字节长度
    offset: 4, // 偏移量
    value: 16
  },
  {
    name: 'Protocol Version', // 协议版本
    key: 'ver',
    bytes: 2,
    offset: 6,
    value: 1
  },
  {
    name: 'Operation', // 指令
    key: 'op',
    bytes: 4,
    offset: 8,
    value: 1
  },
  {
    name: 'Sequence Id',
    key: 'seq',
    bytes: 4,
    offset: 12,
    value: 1
  }
];

export default messageStruct;
