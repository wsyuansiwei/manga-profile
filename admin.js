/* ============================================
   后台管理面板 - JavaScript 逻辑
   登录验证 · 数据编辑 · localStorage 存储
   ============================================ */

// === 通行证密码 ===
const ADMIN_PASSWORD = '19911111';
const STORAGE_KEY = 'manga_profile_data';

// === 默认数据（与 index.html 的初始内容一致） ===
const DEFAULT_DATA = {
    name: {
        chars: ['袁', '思', '伟']
    },
    pageTitle: '袁思伟 | 个人介绍',
    tagline: '程序员 · 创作者 · 探索者',
    about: '我是袁思伟，一名热爱技术和创造的开发者。\n相信代码可以改变世界，也相信每个人都有值得分享的故事。',
    skills: [
        { name: '前端开发', level: 90 },
        { name: '后端开发', level: 85 },
        { name: '系统设计', level: 80 },
        { name: '创意思维', level: 75 },
        { name: '团队协作', level: 70 },
        { name: '咖啡饮用', level: 95 }
    ],
    experience: [
        { emoji: '⚡', title: '快手 · 技术开发', desc: '用代码构建产品，用创新驱动增长' },
        { emoji: '🔥', title: '持续学习中...', desc: '永远在路上，永远不满足' },
        { emoji: '✨', title: '未来', desc: '更多精彩正在书写中...' }
    ],
    interests: [
        { name: '编程', size: 'large' },
        { name: '动漫', size: 'medium' },
        { name: '咖啡', size: 'small' },
        { name: 'AI', size: 'large' },
        { name: '阅读', size: 'medium' },
        { name: '摄影', size: 'small' },
        { name: '开源', size: 'medium' },
        { name: '创作', size: 'large' },
        { name: '游戏', size: 'small' }
    ],
    motto: '一次做对，比反复修补更酷',
    mottoAuthor: '我的开发哲学',
    contact: [
        { icon: '✉', name: '邮件联系', link: '#' },
        { icon: '💬', name: '微信', link: '#' },
        { icon: '🐙', name: 'GitHub', link: '#' },
        { icon: '📝', name: '博客', link: '#' }
    ],
    footerCopyright: '© 2024 袁思伟 | 用 ❤️ 和 ☕ 制作',
    avatar: '' // Base64 编码的照片，默认为空（使用占位符SVG）
};

// === 获取当前数据 ===
function getData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return DEFAULT_DATA;
        }
    }
    return DEFAULT_DATA;
}

// === 保存数据 ===
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// === 登录逻辑 ===
const authScreen = document.getElementById('authScreen');
const adminScreen = document.getElementById('adminScreen');
const passwordInput = document.getElementById('passwordInput');
const authBtn = document.getElementById('authBtn');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');

function checkAuth() {
    const isAuth = sessionStorage.getItem('manga_admin_auth') === 'true';
    if (isAuth) {
        showAdmin();
    }
}

function showAdmin() {
    authScreen.style.display = 'none';
    adminScreen.style.display = 'flex';
    initPhotoUpload(); // 先初始化照片上传的 DOM 引用
    loadFormData();    // 再加载表单数据（包括 loadAvatarPreview）
}

function tryLogin() {
    const pwd = passwordInput.value.trim();
    if (pwd === ADMIN_PASSWORD) {
        sessionStorage.setItem('manga_admin_auth', 'true');
        showAdmin();
    } else {
        authError.textContent = '通行证无效！请输入正确的密码';
        passwordInput.style.borderColor = '#c00';
        passwordInput.value = '';
        passwordInput.focus();
        // 震动效果
        authScreen.querySelector('.auth-card').style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            authScreen.querySelector('.auth-card').style.animation = '';
        }, 500);
    }
}

authBtn.addEventListener('click', tryLogin);
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryLogin();
    authError.textContent = '';
    passwordInput.style.borderColor = '';
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('manga_admin_auth');
    authScreen.style.display = 'flex';
    adminScreen.style.display = 'none';
    passwordInput.value = '';
    authError.textContent = '';
});

// 注入震动动画
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: skewX(-1deg) translateX(0); }
        25% { transform: skewX(-1deg) translateX(-8px); }
        75% { transform: skewX(-1deg) translateX(8px); }
    }
`;
document.head.appendChild(shakeStyle);

// 初始检查
checkAuth();

// === 加载表单数据 ===
function loadFormData() {
    const data = getData();

    // 基本信息 - 姓名字
    renderNameChars(data.name.chars);

    // 基本字段
    setPageTitle(data.pageTitle);
    setFieldInput('tagline', data.tagline);

    // 关于我
    setFieldTextarea('about', data.about);

    // 技能
    renderSkills(data.skills);

    // 经历
    renderTimeline(data.experience);

    // 兴趣
    renderInterests(data.interests);

    // 信条
    setFieldInput('motto', data.motto);
    setFieldInput('mottoAuthor', data.mottoAuthor);

    // 联系方式
    renderContact(data.contact);

    // 底部
    setFieldInput('footerCopyright', data.footerCopyright);

    // 头像照片
    loadAvatarPreview();
}

function setFieldInput(field, value) {
    const input = document.querySelector(`[data-field="${field}"]`);
    if (input) input.value = value || '';
}

function setFieldTextarea(field, value) {
    const textarea = document.querySelector(`[data-field="${field}"]`);
    if (textarea) textarea.value = value || '';
}

function setPageTitle(value) {
    const input = document.querySelector('[data-field="pageTitle"]');
    if (input) input.value = value || '';
}

// === 从当前表单同步数据（保留未保存的输入） ===
function syncFormToData() {
    const data = getData();

    // 姓名
    const charInputs = document.querySelectorAll('.char-input');
    data.name.chars = [];
    charInputs.forEach(input => { data.name.chars.push(input.value); });

    // 基本字段
    data.pageTitle = getFieldValue('pageTitle');
    data.tagline = getFieldValue('tagline');

    // 关于我
    data.about = getFieldValue('about');

    // 技能
    data.skills = [];
    document.querySelectorAll('[data-skill-name]').forEach((nameInput, index) => {
        const levelInput = document.querySelector(`[data-skill-level="${index}"]`);
        data.skills.push({
            name: nameInput.value,
            level: parseInt(levelInput?.value || 50)
        });
    });

    // 经历
    data.experience = [];
    document.querySelectorAll('[data-exp-emoji]').forEach((emojiInput, index) => {
        const titleInput = document.querySelector(`[data-exp-title="${index}"]`);
        const descInput = document.querySelector(`[data-exp-desc="${index}"]`);
        data.experience.push({
            emoji: emojiInput.value,
            title: titleInput?.value || '',
            desc: descInput?.value || ''
        });
    });

    // 兴趣
    data.interests = [];
    document.querySelectorAll('[data-interest-name]').forEach((nameInput, index) => {
        const sizeRadio = document.querySelector(`input[name="interest-size-${index}"]:checked`);
        data.interests.push({
            name: nameInput.value,
            size: sizeRadio?.value || 'medium'
        });
    });

    // 信条
    data.motto = getFieldValue('motto');
    data.mottoAuthor = getFieldValue('mottoAuthor');

    // 联系方式
    data.contact = [];
    document.querySelectorAll('[data-contact-icon]').forEach((iconInput, index) => {
        const nameInput = document.querySelector(`[data-contact-name="${index}"]`);
        const linkInput = document.querySelector(`[data-contact-link="${index}"]`);
        data.contact.push({
            icon: iconInput.value,
            name: nameInput?.value || '',
            link: linkInput?.value || '#'
        });
    });

    // 头像
    data.avatar = currentAvatarData || '';

    // 底部
    data.footerCopyright = getFieldValue('footerCopyright');

    return data;
}

// === 姓名字编辑 ===
function renderNameChars(chars) {
    const container = document.getElementById('nameChars');
    container.innerHTML = '';
    chars.forEach((char, index) => {
        const item = document.createElement('div');
        item.className = 'char-input-item';
        item.innerHTML = `
            <input type="text" class="field-input char-input" data-field="name.char${index + 1}" maxlength="1" value="${char}" placeholder="第${index + 1}个字">
            ${chars.length > 1 ? `<button class="char-remove" onclick="removeChar(${index})">✕</button>` : ''}
        `;
        container.appendChild(item);
    });
}

document.getElementById('addCharBtn').addEventListener('click', () => {
    const data = syncFormToData();
    data.name.chars.push('');
    renderNameChars(data.name.chars);
});

function removeChar(index) {
    const data = syncFormToData();
    if (data.name.chars.length > 1) {
        data.name.chars.splice(index, 1);
        renderNameChars(data.name.chars);
    }
}

// === 技能编辑 ===
function renderSkills(skills) {
    const container = document.getElementById('skillsEditor');
    container.innerHTML = '';
    skills.forEach((skill, index) => {
        const item = document.createElement('div');
        item.className = 'skill-edit-item';
        item.innerHTML = `
            <div class="skill-edit-name">
                <input type="text" value="${skill.name}" data-skill-name="${index}" placeholder="技能名称">
            </div>
            <div class="skill-edit-level">
                <label>等级 (0-100)</label>
                <input type="number" value="${skill.level}" min="0" max="100" data-skill-level="${index}" placeholder="90">
            </div>
            <button class="skill-edit-remove" onclick="removeSkill(${index})">✕</button>
        `;
        container.appendChild(item);
    });
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
    const data = syncFormToData();
    data.skills.push({ name: '', level: 50 });
    renderSkills(data.skills);
});

function removeSkill(index) {
    const data = syncFormToData();
    data.skills.splice(index, 1);
    renderSkills(data.skills);
}

// === 经历编辑 ===
function renderTimeline(items) {
    const container = document.getElementById('timelineEditor');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-edit-item';
        div.innerHTML = `
            <div class="field-group">
                <label class="field-label">标记 Emoji</label>
                <input type="text" class="emoji-input" value="${item.emoji}" data-exp-emoji="${index}" placeholder="⚡">
            </div>
            <div class="field-group">
                <label class="field-label">标题</label>
                <input type="text" class="field-input" value="${item.title}" data-exp-title="${index}" placeholder="公司 · 职位">
            </div>
            <div class="field-group">
                <label class="field-label">描述</label>
                <input type="text" class="field-input" value="${item.desc}" data-exp-desc="${index}" placeholder="一句话描述">
            </div>
            <button class="timeline-edit-remove" onclick="removeTimeline(${index})">✕ 删除此条</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('addTimelineBtn').addEventListener('click', () => {
    const data = syncFormToData();
    data.experience.push({ emoji: '✨', title: '', desc: '' });
    renderTimeline(data.experience);
});

function removeTimeline(index) {
    const data = syncFormToData();
    data.experience.splice(index, 1);
    renderTimeline(data.experience);
}

// === 兴趣编辑 ===
function renderInterests(interests) {
    const container = document.getElementById('interestsEditor');
    container.innerHTML = '';
    interests.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'interest-edit-item';
        div.innerHTML = `
            <div class="interest-edit-name">
                <input type="text" value="${item.name}" data-interest-name="${index}" placeholder="兴趣名称">
            </div>
            <div class="interest-edit-size">
                <input type="radio" name="interest-size-${index}" id="size-small-${index}" value="small" ${item.size === 'small' ? 'checked' : ''}>
                <label for="size-small-${index}" data-interest-size="${index}" data-value="small">小</label>
                <input type="radio" name="interest-size-${index}" id="size-medium-${index}" value="medium" ${item.size === 'medium' ? 'checked' : ''}>
                <label for="size-medium-${index}" data-interest-size="${index}" data-value="medium">中</label>
                <input type="radio" name="interest-size-${index}" id="size-large-${index}" value="large" ${item.size === 'large' ? 'checked' : ''}>
                <label for="size-large-${index}" data-interest-size="${index}" data-value="large">大</label>
            </div>
            <button class="interest-edit-remove" onclick="removeInterest(${index})">✕</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('addInterestBtn').addEventListener('click', () => {
    const data = syncFormToData();
    data.interests.push({ name: '', size: 'medium' });
    renderInterests(data.interests);
});

function removeInterest(index) {
    const data = syncFormToData();
    data.interests.splice(index, 1);
    renderInterests(data.interests);
}

// === 联系方式编辑 ===
function renderContact(items) {
    const container = document.getElementById('contactEditor');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'contact-edit-item';
        div.innerHTML = `
            <div class="contact-edit-icon">
                <input type="text" value="${item.icon}" data-contact-icon="${index}" placeholder="✉">
            </div>
            <div class="contact-edit-name">
                <input type="text" class="field-input" value="${item.name}" data-contact-name="${index}" placeholder="名称">
            </div>
            <div class="contact-edit-link">
                <input type="text" class="field-input" value="${item.link}" data-contact-link="${index}" placeholder="链接 (# 或 URL)">
            </div>
            <button class="contact-edit-remove" onclick="removeContact(${index})">✕</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('addContactBtn').addEventListener('click', () => {
    const data = syncFormToData();
    data.contact.push({ icon: '✉', name: '', link: '#' });
    renderContact(data.contact);
});

function removeContact(index) {
    const data = syncFormToData();
    data.contact.splice(index, 1);
    renderContact(data.contact);
}

// === 收集并保存所有数据 ===
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const notification = document.getElementById('notification');

saveBtn.addEventListener('click', () => {
    const data = collectFormData();
    saveData(data);
    showNotification();
});

resetBtn.addEventListener('click', () => {
    if (confirm('确定要恢复默认数据吗？所有自定义修改将被清除！')) {
        localStorage.removeItem(STORAGE_KEY);
        loadFormData();
        showNotification('数据已恢复为默认值');
    }
});

function collectFormData() {
    return syncFormToData();
}

function getFieldValue(field) {
    const el = document.querySelector(`[data-field="${field}"]`);
    return el ? el.value : '';
}

function showNotification(text) {
    const notifText = notification.querySelector('.notification-text');
    notifText.textContent = text || '保存成功！数据已更新';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// === 侧边导航 ===
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        const sectionId = item.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === 预览按钮更新标题 ===
document.getElementById('previewBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const data = collectFormData();
    saveData(data);
    window.open('index.html', '_blank');
});

// === 照片上传功能 ===
let currentAvatarData = ''; // 临时存储当前头像数据
let photoInput, photoUploadBtn, photoRemoveBtn, photoPreviewImg, photoPlaceholder, photoUploadArea;

// 初始化照片上传相关的 DOM 引用和事件绑定
function initPhotoUpload() {
    photoInput = document.getElementById('photoInput');
    photoUploadBtn = document.getElementById('photoUploadBtn');
    photoRemoveBtn = document.getElementById('photoRemoveBtn');
    photoPreviewImg = document.getElementById('photoPreviewImg');
    photoPlaceholder = document.getElementById('photoPlaceholder');
    photoUploadArea = document.getElementById('photoUploadArea');

    if (!photoInput || !photoUploadBtn) {
        console.warn('Photo upload elements not found');
        return;
    }

    // 文件选择后处理
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件大小（最大 2MB）
        if (file.size > 2 * 1024 * 1024) {
            showNotification('照片太大了！请选择小于 2MB 的图片');
            photoInput.value = '';
            return;
        }

        // 读取文件并转为 Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            // 将图片裁剪为正方形并压缩
            compressAndSquareImage(event.target.result, 300, (compressedData) => {
                currentAvatarData = compressedData;
                showPhotoPreview(compressedData);
            });
        };
        reader.readAsDataURL(file);
    });

    // 移除照片
    photoRemoveBtn.addEventListener('click', () => {
        currentAvatarData = '';
        showPhotoPlaceholder();
        photoInput.value = '';
    });
}

// 显示照片预览
function showPhotoPreview(dataUrl) {
    if (!photoPreviewImg || !photoPlaceholder || !photoRemoveBtn) return;
    photoPreviewImg.src = dataUrl;
    photoPreviewImg.style.display = 'block';
    photoPlaceholder.style.display = 'none';
    photoRemoveBtn.style.display = 'inline-block';
}

// 显示占位符
function showPhotoPlaceholder() {
    if (!photoPreviewImg || !photoPlaceholder || !photoRemoveBtn) return;
    photoPreviewImg.src = '';
    photoPreviewImg.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
    photoRemoveBtn.style.display = 'none';
}

// 将图片压缩并裁剪为正方形
function compressAndSquareImage(dataUrl, targetSize, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 裁剪为正方形（取中心区域）
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        canvas.width = targetSize;
        canvas.height = targetSize;

        // 绘制裁剪后的正方形图片
        ctx.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize);

        // 压缩为 JPEG（质量 0.85）
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        callback(compressed);
    };
    img.src = dataUrl;
}

// 加载已有的头像照片
function loadAvatarPreview() {
    const data = getData();
    if (data.avatar) {
        currentAvatarData = data.avatar;
        showPhotoPreview(data.avatar);
    } else {
        currentAvatarData = '';
        showPhotoPlaceholder();
    }
}