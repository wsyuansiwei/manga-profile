# manga-profile 开发日志

> 项目地址：https://wsyuansiwei.github.io/manga-profile/  
> 后台地址：https://wsyuansiwei.github.io/manga-profile/admin.html  
> GitHub 仓库：https://github.com/wsyuansiwei/manga-profile  
> 本地预览：`cd manga-profile && python3 -m http.server 8080`

---

## 项目结构

```
manga-profile/
├── index.html        # 主页（爆漫风格个人介绍）
├── style.css         # 主页样式
├── script.js         # 主页逻辑（动画 + 数据加载）
├── admin.html        # 后台管理面板
├── admin.css         # 后台样式
├── admin.js          # 后台逻辑
├── data.json         # 已发布的个人数据（所有访客读取此文件）
└── DEVLOG.md         # 本文件
```

---

## 数据流架构

```
后台编辑 → 点"保存" → localStorage（本地浏览器）
         → 点"发布" → GitHub API → data.json（仓库文件）
                                       ↓
                              所有访客加载主页时读取
```

**主页加载优先级**：`data.json`（远端）→ `localStorage`（本地）→ `DEFAULT_DATA`（代码默认值）

**关键常量**：
- `STORAGE_KEY = 'manga_profile_data'`（localStorage key）
- `GITHUB_TOKEN_KEY = 'manga_github_token'`（Token 存储 key）
- `GITHUB_REPO = 'wsyuansiwei/manga-profile'`
- `GITHUB_FILE = 'data.json'`

---

## 功能模块

### 主页（index.html + script.js）

- 6个漫画格：英雄登场 / 技能树 / 经历时间线 / 兴趣星云 / 信条 / 召唤方式
- 动画效果：速度线、粒子、点击音效、鼠标拖尾
- 数据加载：`applyDataToPage(data?)` 函数，接受远端数据或自动读本地
- 入场动画：`fetch('data.json?t='+Date.now())` → 成功则覆盖 localStorage 并渲染

### 后台（admin.html + admin.js）

- **登录**：密码 `19911111`，验证后写 `sessionStorage.manga_admin_auth = true`
- **秘密入口**：连续点击页脚 5 次进入后台
- **编辑模块**：① 基本信息 ② 关于我 ③ 技能树 ④ 经历时间线 ⑤ 兴趣 ⑥ 信条 ⑦ 联系方式 ⑧ 底部版权
- **照片上传**：label 内嵌 input（overlay 方式），FileReader → Canvas 压缩裁方形 → Base64 存储
- **保存**：`collectFormData()` = `syncFormToData()`，写 localStorage
- **发布**：`publishToGithub()` 调用 GitHub Contents API PUT，更新 `data.json`

### 关键函数索引（admin.js）

| 函数 | 位置 | 作用 |
|------|------|------|
| `showAdmin()` | ~L87 | 显示后台，先 `initPhotoUpload()` 再 `loadFormData()` |
| `loadFormData()` | ~L142 | 从 localStorage 填充表单 |
| `syncFormToData()` | ~L194 | 从表单 DOM 读取当前值（含未保存的） |
| `collectFormData()` | ~L458 | = `syncFormToData()`（别名） |
| `initPhotoUpload()` | ~L505 | 绑定照片上传事件（必须在 showAdmin 中调用） |
| `publishToGithub()` | ~L610 | GitHub API 发布 data.json |
| `renderSkills()` | ~L296 | 渲染技能列表 |
| `renderTimeline()` | ~L327 | 渲染经历列表 |
| `renderInterests()` | ~L365 | 渲染兴趣列表 |
| `renderContact()` | ~L402 | 渲染联系方式列表 |

---

## 已修复的 Bug 记录

### BUG-01：技能等列表新增/删除时，已填内容被重置
- **根因**：新增/删除时调用 `getData()`（读 localStorage 旧数据）重新渲染，覆盖了未保存的输入
- **修复**：添加 `syncFormToData()` 函数，操作前先从 DOM 读取当前值；所有 add/remove 按钮改用 `syncFormToData()` 替代 `getData()`

### BUG-02：照片上传按钮点击无反应（历史问题）
- **根因历史**：
  1. 第一版：`display:none` 的 file input，JS `.click()` 被浏览器安全策略阻止
  2. 第二版：`setTimeout + photoInput.click()`，仍被阻止
  3. 第三版：`<label for="photoInput">` + `display:none` input，label 对 `display:none` 的 input 无效
- **最终修复**：`<label>` 内嵌 `<input type="file">`，CSS 让 input 绝对定位覆盖 label（`opacity:0`），label 可见可点击

### BUG-03：照片选中后页面无变化 + 所有按钮失效
- **根因**：`showAdmin()` 中先调用 `loadFormData()` → `loadAvatarPreview()` → `showPhotoPreview()` → 此时 `photoPreviewImg` 等变量还是 `null`（`initPhotoUpload()` 未执行）→ JS 报错整个脚本崩溃
- **修复**：`showAdmin()` 中调整顺序为先 `initPhotoUpload()` 再 `loadFormData()`；给 `showPhotoPreview/showPhotoPlaceholder` 加 null 检查

### BUG-04：`Cannot access 'photoInput' before initialization`（TDZ 报错）
- **根因**：浏览器缓存了旧版 admin.js（含顶层 `const photoInput = ...`），新版 admin.js 中 `let photoInput` 声明在文件后半段，两个版本的变量作用域冲突触发 TDZ
- **修复**：
  1. 将 `let photoInput` 等所有照片变量声明移到文件**第一行**（`STORAGE_KEY` 之后）
  2. 版本号从 `?v=4` 改为 `?v=20260618`，强制所有浏览器重新下载

### BUG-05：修改内容后别人看不到（核心架构问题）
- **根因**：数据只存在自己浏览器的 localStorage，他人访问 GitHub Pages 拿到的是静态初始文件
- **修复**：引入 `data.json` 作为共享数据源 + GitHub Contents API 发布功能

---

## 版本说明

当前 HTML/CSS/JS 版本号均为 `?v=20260618`，下次修改文件后需同步更新版本号（改为更新日期）以确保用户浏览器加载最新文件：
- `index.html` 中：`style.css?v=` 和 `script.js?v=`
- `admin.html` 中：`admin.css?v=` 和 `admin.js?v=`

---

## 待优化方向（潜在需求）

- [ ] 后台实时预览（编辑时同步显示效果）
- [ ] 照片裁剪 UI（目前是自动取中心正方形）
- [ ] 发布历史记录
- [ ] 多语言支持
- [ ] 移动端后台优化
- [ ] 访问统计

---

## 操作手册

### 更新线上内容
1. 访问 `admin.html` → 输入密码 `19911111`
2. 编辑内容 → 点 **💾 保存所有修改**
3. 在"发布到线上"区域填入 GitHub Token → 点 **🚀 发布到线上**
4. 约 1 分钟后 `data.json` 更新，所有人可见最新内容

### 获取 GitHub Token
1. 访问：https://github.com/settings/tokens/new?description=manga-profile&scopes=repo
2. 勾选 `repo` 权限
3. 复制生成的 Token（Token 会保存在你的 localStorage 中，下次无需重填）

### 本地开发
```bash
cd /Users/yuansiwei/.codeflicker/workshop/manga-profile
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### 推送更新
```bash
cd /Users/yuansiwei/.codeflicker/workshop/manga-profile
git add -A && git commit -m "描述改动" && git push origin main
```
