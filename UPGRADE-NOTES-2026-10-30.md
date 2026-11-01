# SWIRL Web Wallet — 2026-10-30 修复与升级记录

本文单独记录 2026-10-30 的钱包修复。后续升级、重构或同步 Chrome 扩展时，必须保留这些行为，并重新执行对应回归测试。

## 1. 刷新后的钱包与视图恢复

### 已完成

- 钱包解锁会话使用 AES-GCM 加密后保存在 `sessionStorage`，加密密钥为 IndexedDB 中不可导出的 CryptoKey。
- 新增余额与 Activity 的加密视图快照：
  - 会话键：`swirl.wallet-view-session.v1`。
  - 快照绑定 `chainId + EVM account`，防止跨网络或跨账户误恢复。
  - BigInt 以字符串序列化，读取时再恢复为 BigInt。
- 页面刷新后先显示快照中的余额和 Activity，后台继续同步链上最新数据。
- 恢复快照完成后再设置钱包状态，避免较慢的旧快照覆盖已经开始的新链上刷新。
- 快照保存纳入刷新流程；刷新完成前等待加密写入结束，避免交易成功后立即刷新读到旧快照。
- 锁定钱包时同时清除钱包解锁会话和视图快照。

### 安全边界

- 不得改成明文 localStorage / sessionStorage 余额或钱包缓存。
- 不得持久化助记词、EVM 私钥、支付密钥、解密后的 Note 或 Merkle Tree。
- 视图快照只是加速显示，链上后台同步仍是最终数据来源。

## 2. 同步性能与重复请求

### 已完成

- 同一次 `refresh()` 内按 `vault.toLowerCase()` 合并 Note 同步 Promise。
- 主网 ETH、USDC、USDT 使用同一 Vault 时，只执行一次 Note 同步，不再为每个资产重复建树和解密。
- 保留 `requestId` 检查，旧请求不得覆盖新网络、新账户或新交易后的状态。
- Activity 读取完成后再次检查 `requestId`。

### 升级约束

- 多资产共享 Vault 的合并键必须来自实际 Vault 地址，不得按资产符号合并。
- 不得为了提速删除后台真实同步或并发请求失效保护。

## 3. 操作后的自动刷新

### 已完成

以下流程不再需要用户手动点击 Refresh：

- Shield。
- 公开转账与私密转账。
- Unshield。
- Gas 账户充值：同时更新主钱包余额、Gas 余额和 Activity。
- 待处理 PPOI 完成重试后：先刷新，再显示完成提示。

交易流程现在先记录 Activity，再等待 `refresh()` 与 `refreshGas()`，最后显示交易成功提示。这样成功提示出现时，余额与 Activity 已更新。

### 升级约束

- 不得把交易后的刷新改回fire-and-forget，否则成功提示与余额可能再次不同步。
- 刷新失败仍须保留明确错误状态；不得因为链已确认就重复提交交易。

## 4. 今日早些时候的已上线优化

以下项目来自当日工作记录，本轮快照与自动刷新修复没有重复执行全部计时验收：

- Brotli 压缩证明资源、Cache Storage 持久缓存和 Web Worker 证明计算。
- Shield 等待链上确认期间预取 Unshield 所需的 transfer 证明资源。
- 主网私密交易等待期间预取 PPOI 证明资源。
- 使用共享 Indexer，健康时避免 RPC `eth_getLogs` 扫描。
- Ethereum 与 Sepolia RPC fallback；主网广播遇到 429 时可切换备用 RPC。
- 修复页面刷新后钱包掉线、余额显示不一致及本地 Activity 不显示的问题。

## 5. 本轮实际验证结果

- `next build`：通过。
- 钱包核心 Vitest：5 / 5 通过。
- 线上会话浏览器验证：
  - 人为延迟 Indexer 请求后，刷新仍先显示缓存余额。
  - 恢复前后钱包地址一致。
  - 会话与视图快照均不含明文助记词。
  - Lock 后两个 session key 均清除。
  - 共享 Indexer 返回 200，未回退到 RPC 日志扫描。
- 真实 Sepolia Shield → Unshield：
  - 两笔真实测试网交易完成。
  - Shield 后私密余额自动增加，Activity 自动出现交易。
  - Unshield 后私密余额自动归零、公开余额自动增加，Activity 自动出现两笔交易。
  - 操作后未点击手动 Refresh。
  - 证明资源刷新后仍保留缓存。
- 主网 RPC 模拟 429 与 fallback 广播回归通过；没有发送真实主网交易。

## 6. 后续升级待办

- 将本轮会话快照、同 Vault 合并同步及操作后自动刷新同步到 Chrome 扩展，再生成新的上传包。
- 扩展审核中的旧包不能视为已包含这些修复；新版本上传后需重新跑浏览器回归。
- Sepolia 当前配置未启用 PPOI；本轮没有验证 Sepolia PPOI。
- 主网 PPOI 资源预取尚未做真实主网链上计时验收，不得写成已验证。
- 每次修改会话、同步或交易刷新逻辑后，至少重新执行：

```bash
npm run build
npm exec -- vitest run lib/swirl-wallet/wallet.test.js
node verify-online-dapp-session.mjs
node verify-online-mainnet-shield-rpc.mjs
```

真实 Sepolia 全链路测试使用 `verify-online-sepolia-unshield-e2e.mjs`，测试私钥只通过环境变量临时提供，不得写入源码、文档或仓库。

## 7. Gas 默认值与 DAPP 视觉升级（当日追加）

### Gas 支付

- 新用户默认 Fee payer 改为 `main`：用户自己的 EVM 钱包直接支付网络 Gas。
- 设置存储升级为 `swirl.wallet-settings.v2`；旧 v1 用户首次加载时一次性迁移到自有 EVM 钱包，同时保留自动锁定和隐藏网络设置。
- Relayer 与独立 Gas 账户仍作为可选项保留，没有删除协议能力。
- 交易确认页的 Fee payer 文案统一为 `Your EVM wallet`。
- 后续升级不得无提示地把用户迁移回 Relayer；更改支付默认值必须单独记录并做迁移测试。
- 本次 Gas 默认值变更目前只上线 Web DAPP；Chrome 扩展不单独发版，纳入扩展下一版本统一更新，发布前重新验证默认支付与旧设置迁移。

### 视觉与交互

- 导航图标统一为 18px 线性图标与圆角图标容器，补齐选中、悬停、焦点和减少动画偏好状态。
- 新增 `dapp-premium.css`，集中管理侧栏、顶栏、卡片、表格、表单、按钮、Activity 和反馈样式。
- 保留 SWIRL 青色品牌与深色赛博风格，同时适配浅色主题和移动端。
- 浏览器验证已覆盖旧 Relayer 设置迁移、v2 持久化、深色/浅色切换、钱包刷新恢复和 Lock 清理。
- 修改基础设计变量后必须检查两种主题，特别等待主题过渡结束再验收原生 `select` 与 SVG 图标颜色。

## 8. 主网 Shield 成功却提示失败（当日追加）

### 实际链上事实

- 用户交易：`0x2691bd4458bf8ed57732bcac075e2bce720c5da379aa9c23d68e87353ddabbfe`。
- 主网回执 `status = 1`，Shield 在链上成功，并未 revert。
- 用户支付 `0.001 ETH`，Shield Note 金额 `0.0009975 ETH`，协议费 `0.0000025 ETH`。
- 该笔交易不得重复提交；误报来自 Web DAPP 的确认和提示流程。

### 根因与修复

- 原流程只等待接收广播的 RPC 返回回执；该节点滞后或超时，会把已提交甚至已成功的交易按错误处理。
- 新增 `waitForTransactionReceipt`：广播后并行查询主 RPC、接收节点和全部备用 RPC，任一节点返回回执即按真实状态处理。
- Shield、Native Unshield、私密转账、Relayer 提交和公开转账统一使用多 RPC 确认。
- 全部节点暂时无法确认时使用 `CONFIRMATION_PENDING`，明确提示“已提交、待确认、不要重试”，不再笼统显示交易失败。
- 链上确认后，本地 Activity 保存或余额刷新失败只能追加界面警告，不得把交易成功改成失败。

### 验证与升级约束

- 主网故障模拟覆盖：主 RPC 广播 429 → 备用 RPC 接收 → 接收节点持续 pending → 另一节点返回成功回执。
- 最终页面显示 Shield confirmed、无错误样式，Activity 自动记录交易；测试未发送真实主网交易。
- 钱包核心 5 项测试、构建和会话刷新回归通过。
- 后续不得改回只查询单一 RPC；任何已广播哈希都必须先区分 reverted、confirmed 和 confirmation pending。
- 本次确认与提示修复同步纳入 Chrome 扩展下一版本，并复用同一故障模拟回归。

### 第二笔主网误报与确认后同步异常（当日追加）

- 用户交易：`0x332f53a19ab844c100154756ca813ed5f312a1fa32eaa9a6f537ff8ecb6a7fe2`。
- 主网回执 `status = 1`，区块 `26305315`，Shield 叶子索引 `34`，链上成功，并未 revert。
- 用户支付 `0.0001 ETH`，Shield Note 金额 `0.00009975 ETH`，协议费 `0.00000025 ETH`；不得重复提交。
- 第二条覆盖路径已复现：交易确认后，`refresh()` 内的 Indexer／RPC 日志同步错误调用 `setError()`；由于反馈区优先渲染 `error`，红色同步错误覆盖了已设置的成功提示。
- 修复规则：只有在 `receipt.status === 1` 已明确成立后，最终设置成功提示前清除确认后产生的界面同步错误；真实 revert 仍在此前直接拦截，不得被该清理掩盖。
- 线上模拟同时覆盖：主 RPC 广播 429、备用 RPC 接收且持续 pending、另一 RPC 返回成功回执、确认后 Indexer 503、确认后 RPC 日志查询 503。最终仍显示 Shield confirmed、无错误样式，Activity 自动记录；未发送真实主网交易。
- 修复后的构建、钱包核心 5 项测试及线上会话回归全部通过；该提示优先级修复纳入 Chrome 扩展下一版本。

## 9. PPOI 等待状态与自动可选（当日追加）

- 保留上游等待规则：Ethereum 主网 Shield 后等待 1 小时，公开测试网等待 1 分钟；随后仍需 PPOI 名单审核变为 `Valid`，不得跳过审核或人工改成可解除护盾。
- Web DAPP 的解除护盾 Note 列表现在显示 `PPOI wait · 剩余时间`，等待期结束后显示 `Reviewing PPOI…`，审核通过后显示 `Available` 并自动允许选择；Spent、Blocked、Unavailable 等状态保留独立文案。
- 倒计时使用 Shield 所在区块的链上时间戳，而不是浏览器打开时间或本地交易记录时间；区块时间读取失败只隐藏具体倒计时，不影响 PPOI 状态与后续自动刷新。
- 有待审核 Note 时，页面每秒更新倒计时、每 30 秒重新同步，并在最近一个等待期结束后 2.5 秒额外同步；交易执行期间不自动刷新，避免干扰提交。
- 验证：生产构建通过；新增 PPOI 状态测试 6 项与钱包核心测试 5 项，共 11 项通过；线上首页和 DAPP 均返回 200，会话恢复与主网 RPC 故障模拟回归通过。故障模拟未发送真实交易。
- 本次没有用真实用户 Note #33/#34 做浏览器倒计时验收，因此只能确认规则实现、单元测试和线上回归，不宣称已验证这两笔的实际审核结果。
- 本次只上线 Web DAPP；同样的 PPOI 状态体验纳入 Chrome 扩展下一版本，扩展源码尚未同步。

## 10. 主网 Unshield 长时间停在 Loading prover resources（当日追加）

- 实测 Fastly 主线路在当前网络下 60 秒仅下载约 0.99 MB，Gcore 备用线路约 24 秒完整下载 5.81 MB；原顺序会先在慢线路消耗固定的 45 秒总超时。
- 主网与测试网共用加载器，现将 Gcore 调整为第一下载源，Fastly 和本站资源仍依次作为备用；缓存键保持不变，已有有效缓存不需要重新下载。
- 固定的 45 秒总下载时限改为 20 秒无数据停滞超时：慢速但持续传输时允许继续，不再因为文件较大而强制从头换源。
- Shield 后台预取与后续 Unshield 现在共享实时进度订阅，不再只显示无百分比的固定文字，也不会重复下载同一资源。
- 验证：资源线路及预取进度共享测试通过；生产构建通过；资源、PPOI 和钱包核心共 12 项测试通过；线上主网 RPC 故障模拟及会话回归通过，未发送真实交易。
- 本次只上线 Web DAPP；资源加载修复同步纳入 Chrome 扩展下一版本，扩展源码尚未同步。

## 11. SWIRL 自有 IPFS 证明资源（当日追加）

- 使用官方 `ipfs/kubo`，最终升级为 `v0.43.1`；资源目录 CID：`QmVD4i6wenndzEhKWFogkB1sqAjvLCYDgkdmUCvyUFr25E`。
- 四个 `.br` 文件均通过 Pinata 公共 IPFS 网关实际下载，SHA-256 与本地原文件完全一致，响应包含 `Access-Control-Allow-Origin: *`。
- `ipfs-lb.com` 能读取上游既有 CID，但持续无法检索本次新 CID，因此没有将它接入生产；当前使用已验证可用的 `gateway.pinata.cloud`。
- Web DAPP 下载顺序调整为：自有 IPFS → Gcore → Fastly → 本站。缓存键和既有有效缓存保持兼容。
- 线上真实浏览器模拟已确认两个 Transfer 资源仅从自有 IPFS 下载并成功写入 CacheStorage，没有触发备用线路；生产构建及 12 项测试通过，未发送真实交易。
- Kubo 已迁移到 `/opt/cipherpay-web/.ipfs-node`，由 `swirl-ipfs.service` 持久管理；服务为 `active + enabled`，使用独立 `14001/tcp`。已执行 `systemctl restart swirl-ipfs` 验证自动恢复、Kubo 版本、local gateway 200 和 CID 广播；未重启整台服务器，因此开机启动以 systemd `enabled` 状态确认，不写成重启实测。
- `_web_activate.py` 已加入节点保护：网站更新时先停止 `swirl-ipfs`，将 `.ipfs-node` 从备份目录迁回新网站目录，再启动节点并检查 local gateway，避免部署删除节点数据。
- 持久化后再次通过 Pinata 公共网关下载全部四个文件并核对 SHA-256 一致。运维命令：`systemctl status swirl-ipfs`、`systemctl restart swirl-ipfs`、`journalctl -u swirl-ipfs -n 100 --no-pager`。Gcore、Fastly 和本站备用线路仍保留。
- 本次只上线 Web DAPP；IPFS 下载源纳入 Chrome 扩展下一版本，扩展源码尚未同步。
