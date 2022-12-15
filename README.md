# Tezos 集成说明

## 官方文档

给 Ceramic 添加链支持的文档见此[链接](https://did.js.org/docs/guides/add-chain-support)

## 现有代码

- 根据参数产生 siwx 结构化签名的代码见 `js-did/packages/cacao/src/siwx/siwTezos.ts`
- 根据 siwx 产生 cacao 对象的方法见 `js-did/packages/cacao/src/cacao.ts` 文件中的 `fromSiwTezosMessage` 方法
- 签名 siwx 和 cacao 对象的方法见 `js-did/packages/pkh-tezos/src/authmethod.ts`
- 验证 cacao 对象的方法见 `js-did/packages/pkh-tezos/src/verifier.ts`
- 演示的 demo 代码见 `js-did/demo/demo1/src/App.tsx`，演示了如何拉起钱包生成 cacao 对象，然后验证 cacao 对象

## 仍需解决的问题

- 提交 [CAIP10 spec](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md)
- 提交 [CAIP122 spec](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-122.md)

## 可能存在的问题

- 现有代码只考虑了 Tezos tz1 账户类型，除此之外 Tezos 还有 tz2、tz3、kt 账户不清楚是否需要支持
- Tezos 的验签需要传入账户的 PK (public key)，而 cacao 对象里只记录了 Tezos 账户的 address，而没有 address 对应的 PK，现在的解决方式是验签时向 tzstats 的 API 发请求来查询 address 对应的 PK，这样的影响就是只有在 tzstats 能查到 PK 的 address 才能被 ceramic 节点验证。经测试，新账户充值余额，然后发起一笔转账交易后，其 PK 就能在 tzstats 被查到。

<br />

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