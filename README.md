## bilive-danmaku

bilibili直播弹幕客户端(非官方)，支持windows和IOS

### 使用

[下载 Release](https://github.com/Beats0/bilive-danmaku/releases)

### Note!

1. 关于显示头像功能:

已经做了限定访问用户api，频率最大为 5个/s，每次获取头像成功后自动保存用户数据，7天后过期。

尽管已经做了限定，但还是有小几率会因大量访问api导致被ban ip，大约10分钟后自动解封。换言之，只要用户数据保存得越多，被ban的几率就越小。

2. Dev Tool

release 版也可开启Dev Tool，用来检查线上版本错误和日志，`Ctrl+R` 可重载。


### 功能

面板和官方web端几乎一模一样，主要拓展了订阅列表，弹幕翻译，语音朗读，多语言配置等功能

支持的消息类型

```js
LIVE                // 开播消息
POPULAR             // 人气
DANMU_MSG           // 弹幕消息
SEND_GIFT           // 礼物消息
SPECIAL_GIFT        // TODO
COMBO_SEND          // 礼物连击消息
COMBO_END           // TODO 礼物连击结束消息
NOTICE_MSG          // 广播消息
WELCOME             // 欢迎进入直播间
WELCOME_GUARD       // 欢迎舰长进入直播间
GUARD_BUY           // 上舰消息
SUPER_CHAT_MESSAGE  // SC消息
```

### TODO

- [ ] 完善消息类型
- [ ] 样式优化
- [ ] 热更新


### 开发

dev

```sh
# install
$ yarn -i

# run dev
$ yarn dev
```

build

```sh
# 本平台打包
$ yarn package

# 多平台打包
$ yarn package-all

# 各个平台打包
$ yarn package-mac
$ yarn package-linux
$ yarn package-win

# ci
$ yarn package-ci
```

### LICENSE

[MIT](https://github.com/Beats0/bilive-danmaku/master/LICENSE)
