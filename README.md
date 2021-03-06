# bilive-danmaku

<div align="center">

![logo](https://beats0.github.io/bilive-danmaku/resources/icons/96x96.png)
<br>
bilibili 直播弹幕姬(非官方)，支持 win 和 mac
<br>

</div>

### 预览

![https://wx1.sinaimg.cn/large/006nOlwNly1gfiygt1rr4j31hc0tvqv5.jpg](https://wx1.sinaimg.cn/large/006nOlwNly1gfiygt1rr4j31hc0tvqv5.jpg)

[视频预览](https://www.bilibili.com/video/av328551804)

### 使用

[下载 Release](https://github.com/Beats0/bilive-danmaku/releases)

输入房间号: 在锁定情况下，输入 RoomID 即可

拖动: 在非锁定情况下，按住并拖动顶部即可

### 功能

面板和官方 web 端几乎一模一样，主要拓展了订阅列表，弹幕翻译，语音朗读，多语言配置等功能

支持的消息类型

```
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
- [ ] 性能优化
- [ ] 热更新

### 注意 Note!

1. 关于显示头像功能

已经做了限定访问用户 api，频率最大为 5 个/s，每次获取头像成功后自动保存用户数据，7 天后过期。

尽管已经做了限定，但还是有小几率会因大量访问 api 导致被 ban ip，大约 10 分钟后自动解封。换言之，只要用户数据保存得越多，被 ban 的几率就越小。

2. 翻译和朗读

大量使用 google translate api，超出官方调用频率会导致请求超时，翻译或朗读失败。

3. 自定义样式(仅支持昵称样式和弹幕样式)

release 版也可开启 Dev Tools，用来检查线上版本错误和日志，点击 Dev Tools，编写对应的编辑 CSS 样式，只复制 css 声明语句，例如上图的 css 为

```css
text-shadow: 1px 1px 2px #e91e63, 0 0 0.2em #e91e63;
```

然后填入到 `设置` > `自定义样式` 中，`Ctrl+R` 重载即可。

4. 每次更新后请点击 `设置` 中的 `重置`，保持更新数据同步，但以前的部分配置数据会丢失。

### 已知 BUG

- mac 在全屏模式下无法置于顶层

### 开发

[README_DEV](https://github.com/Beats0/bilive-danmaku/blob/master/README_DEV.md)

### [更新日志](https://github.com/Beats0/bilive-danmaku/blob/master/CHANGELOG.md)

### LICENSE

[MIT](https://github.com/Beats0/bilive-danmaku/blob/master/LICENSE)

[MIT © Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
