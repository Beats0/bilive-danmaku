# DEV

开发文档

## 安装

eslint配置不生效，JSX代码格式各种警告，实在搞不动了，有代码强迫症的把eslint 检查关了吧 = =

## 命令

调试 dev

```sh
# install
$ yarn -i

# run dev
$ yarn start
```

打包 package

默认打包将输出到 release 文件夹中

```sh
# 打包
$ yarn package
```

## 已知 BUG

- mac dev 模式无法使用透明背景, 生产模式又可以了= =，不影响功能

参考

[mac os 无法使用透明背景](https://github.com/electron/electron/issues/20357)

## 快速生成icns图标

```
sips -z 16 16     pic.png --out icon/icon_16x16.png
sips -z 24 24     pic.png --out icon/icon_24x24.png
sips -z 32 32     pic.png --out icon/icon_32x32.png
sips -z 48 48     pic.png --out icon/icon_48x48.png
sips -z 64 64     pic.png --out icon/icon_64x64.png
sips -z 96 96     pic.png --out icon/icon_96x96.png
sips -z 128 128   pic.png --out icon/icon_128x128.png
sips -z 256 256   pic.png --out icon/icon_256x256.png
sips -z 512 512   pic.png --out icon/icon_512x512.png
sips -z 1024 1024   pic.png --out icon/icon_1024x1024.png
```

```sh
iconutil -c icns icon -o Icon.icns
```
