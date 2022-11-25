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

dids 库

```
# 根目录下
cd js-did/packages/dids
pnpm pack
```

@didtools/cacao 库

```
# 根目录下
cd js-did/packages/cacao
pnpm pack
```

@didtools/pkh-tezos 库

```
# 根目录下
cd js-did/packages/pkh-tezos
pnpm pack
```

```
# 根目录下
cd js-did/packages/did-session
pnpm pack
```

## 3. 安装 js-ceramic 依赖

dids 和 cacao 库的 link 已经写进 js-ceramic 各个子库的配置中了，直接安装即可

```
# 根目录下
cd js-ceramic
npm install
npm run build
```

## 4. 本地启动 ceramic daemon

在单独的一个 terminal 里运行

```
# 根目录下
cd js-ceramic
node ./packages/cli/bin/ceramic.js daemon
```

之后 ceramic daemon 会运行在 localhost:7007

## 5. 运行 demo

```
# 根目录下
cd demo
pnpm install
pnpm run dev
```

调试代码写在 `./src/App.tsx`

## 6. 修改 js-dids 里 cacao、did、pkh-tezos 库的代码

修改后重复步骤2-步骤5，使改动生效。

可能需要写的逻辑：

- 针对 tezos 写 CacaoVerifier 和 authmethod


