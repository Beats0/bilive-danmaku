# bilive-danmaku

<div align="center">

![logo](https://beats0.github.io/bilive-danmaku/resources/icons/96x96.png)
<br>
bilibili直播弹幕客户端(非官方)，支持win和mac
<br>
</div>

### 预览

![yaya](https://wx1.sinaimg.cn/large/006nOlwNly1gfiygt1rr4j31hc0tvqv5.jpg)

[>_<]:
![](https://wx1.sinaimg.cn/large/006nOlwNly1gfiz0kobi3j31hc0u0qv6.jpg)


### 使用

[下载 Release](https://github.com/Beats0/bilive-danmaku/releases)

输入房间号: 在锁定情况下，输入RoomID即可

拖动: 在非锁定情况下，按住并拖动顶部即可


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
- [ ] 性能优化
- [ ] 热更新


### 注意 Note!

1. 关于显示头像功能

已经做了限定访问用户api，频率最大为 5个/s，每次获取头像成功后自动保存用户数据，7天后过期。

尽管已经做了限定，但还是有小几率会因大量访问api导致被ban ip，大约10分钟后自动解封。换言之，只要用户数据保存得越多，被ban的几率就越小。

2. 翻译和朗读

大量使用google translate api，超出官方调用频率会导致请求超时，翻译或朗读失败。

3. 自定义样式(仅支持昵称样式和弹幕样式)

release 版也可开启Dev Tools，用来检查线上版本错误和日志，点击Dev Tools，编写对应的编辑CSS样式，只复制css声明语句，例如上图的css为

```css
text-shadow: 1px 1px 2px #E91E63, 0 0 0.2em #E91E63;
```

然后填入到 `设置` > `自定义样式` 中，`Ctrl+R` 重载即可。


### 开发

调试 dev

```sh
# install
$ yarn -i

# run dev
$ yarn dev

# 生产模式调试
$ yarn start
```

打包 build

默认打包将输出到release文件夹中

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
