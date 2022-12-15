# Tezos 集成说明

## 官方文档

给 Ceramic 添加链支持的文档见此[链接](https://did.js.org/docs/guides/add-chain-support)

# 测试说明

## 1. 安装 js-did 的依赖

```
# 根目录下

cd js-did
pnpm install
pnpm build
```

## 2. 打包相应库

@didtools/cacao 库

```
# 根目录下
cd js-did/packages/cacao
pnpm pack
```

## 3. 修改代码
```
# 根目录下
js-did/packages/dids/package.json

"@didtools/cacao": "workspace:^1.0.0",

将该库的路径改成 file:自己电脑中对应文件的绝对路径

如："@didtools/cacao": "file:/Users/me/Documents/GitHub/tezos-ceramic/js-did/packages/cacao/didtools-cacao-1.0.1.tgz",
```

## 4. 打包相应库

@didtools/dids 库

```
# 根目录下
cd js-did/packages/dids
pnpm pack
```

## 5. 修改代码
```
# 根目录下
js-did/packages/did-session/package.json

"dids": "workspace:^3.2.0",
"@didtools/cacao": "workspace:^1.0.0",

将以上两个库的路径改成 file:自己电脑中对应文件的绝对路径

如："dids": "file:/Users/me/Documents/GitHub/tezos-ceramic/js-did/packages/dids/dids-3.4.1.tgz",
"@didtools/cacao": "file:/Users/me/Documents/GitHub/tezos-ceramic/js-did/packages/cacao/didtools-cacao-1.0.1.tgz",
```
```
# 根目录下
js-did/packages/pkh-tezos/package.json

"@didtools/cacao": "workspace:^1.0.0",

将该库的路径改成 file:自己电脑中对应文件的绝对路径

如："@didtools/cacao": "file:/Users/me/Documents/GitHub/tezos-ceramic/js-did/packages/cacao/didtools-cacao-1.0.1.tgz",
```

## 6. 打包相应库

@didtools/pkh-tezos 库

```
# 根目录下
cd js-did/packages/pkh-tezos
pnpm pack
```

@didtools/did-session 库

```
# 根目录下
cd js-did/packages/did-session
pnpm pack
```

## 7. 安装 js-ceramic 依赖

dids 和 cacao 库的 link 已经写进 js-ceramic 各个子库的配置中了，直接安装即可

```
# 根目录下
cd js-ceramic
npm install --force
npm run build
```

## 8. 本地启动 ceramic daemon

在单独的一个 terminal 里运行

```
# 根目录下
cd js-ceramic
node ./packages/cli/bin/ceramic.js daemon
```

之后 ceramic daemon 会运行在 localhost:7007

## 9. 运行 demo

```
# 根目录下
cd demo
pnpm install
pnpm run dev
```

调试代码写在 `./src/App.tsx`

## 10. 验证

加入如下代码（目前是已经加上的）后在服务器运行ceramic daemon，签名可以验证通过，并且可以正常创建stream; 如果删除这段代码，则签名会验证失败，且不能正常创建stream。

![](https://bafybeifkju3g6j55z7uumvjaf7nyp55ngguiagm2qcit6kkw6a42yay5ee.ipfs.w3s.link/1669387418.jpg)

![](https://bafybeidyao62nh2iteajcx3ze3b2bwa722ybmuw7utm7pr7qy43fmy2w5y.ipfs.w3s.link/1669387971.jpg)

## 注： 代码修改

若修改了 js-dids 里 cacao、did、pkh-tezos 库的代码，则需要重复步骤1-步骤9，使改动生效。