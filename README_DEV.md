# DEV

开发文档

## 安装

安装尽量翻墙

eslint配置不生效，JSX代码格式各种警告，实在搞不动了，有代码强迫症的把eslint 检查关了吧 = =

## 命令

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

默认打包将输出到 release 文件夹中

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

## win

- 打包失败

如果开启了火绒，关闭火绒

- 打包后无法正常工作

以生产模式模式运行并 debug

```sh
yarn start
```

## mac

- 下载 darwin 失败，打包失败

```
downloading     url=https://github.com/electron/electron/releases/download/v7.1.13/electron-v7.1.13-darwin-x64.zip size=64 MB parts=8
  • retrying        attempt=1
  • retrying        attempt=1

  ⨯ part download request failed with status code 403
github.com/develar/app-builder/pkg/download.(*Part).doRequest
	/Volumes/data/Documents/app-builder/pkg/download/Part.go:126
github.com/develar/app-builder/pkg/download.(*Part).download
```

将文件下载下来并放入 electron cache 文件夹中

参考

[issues: part download request failed with status code 416](https://github.com/electron-userland/electron-builder/issues/3115)

[electron cache doc](https://www.electronjs.org/docs/tutorial/installation#cache)

## 已知 BUG

- mac dev 模式无法使用透明背景, 生产模式又可以了= =，不影响功能

参考

[mac os 无法使用透明背景](https://github.com/electron/electron/issues/20357)
