/* ============================================
   爆漫风格个人介绍 - 交互脚本
   速度线、动画、漫画效果
   + 后台数据动态加载
   ============================================ */

const STORAGE_KEY = 'manga_profile_data';

// === 默认数据 ===
const DEFAULT_DATA = {
    name: { chars: ['袁', '思', '伟'] },
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
    avatar: ''
};

function getLocalData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
    }
    return DEFAULT_DATA;
}

// === 动态加载后台数据到页面 ===
function applyDataToPage(data) {
    data = data || getLocalData();

    // 1. 页面标题
    document.title = data.pageTitle || DEFAULT_DATA.pageTitle;

    // 2. 姓名字
    const heroName = document.getElementById('heroName');
    if (heroName) {
        heroName.innerHTML = '';
        data.name.chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'name-char';
            span.dataset.delay = index;
            span.textContent = char;
            // 重新触发动画
            span.style.animation = 'charAppear 0.5s ease-out forwards';
            span.style.animationDelay = `${index * 0.2}s`;
            heroName.appendChild(span);
        });
    }

    // 3. 个人标签
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        heroTagline.textContent = data.tagline || DEFAULT_DATA.tagline;
    }

    // 3.5 头像照片
    if (data.avatar) {
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.innerHTML = `<img src="${data.avatar}" alt="头像" style="width:100%;height:100%;object-fit:cover;">`;
        }
    }

    // 4. 关于我
    const speechBubble = document.querySelector('.speech-bubble.right');
    if (speechBubble) {
        speechBubble.innerHTML = '';
        const lines = (data.about || DEFAULT_DATA.about).split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            speechBubble.appendChild(p);
        });
    }

    // 5. 技能
    const skillGrid = document.querySelector('.skill-grid');
    if (skillGrid) {
        skillGrid.innerHTML = '';
        const skills = data.skills || DEFAULT_DATA.skills;
        skills.forEach(skill => {
            const item = document.createElement('div');
            item.className = 'skill-item';
            item.innerHTML = `
                <div class="skill-bar">
                    <div class="skill-fill" data-level="${skill.level}"></div>
                </div>
                <span class="skill-name">${skill.name}</span>
            `;
            skillGrid.appendChild(item);
        });
        // 重新触发技能条填充（需要等面板可见后）
        skillBarNeedsUpdate = true;
    }

    // 6. 经历
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.innerHTML = '';
        const exps = data.experience || DEFAULT_DATA.experience;
        exps.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-marker">${exp.emoji}</div>
                <div class="timeline-info">
                    <h3>${exp.title}</h3>
                    <p>${exp.desc}</p>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    // 7. 兴趣标签
    const interestCloud = document.querySelector('.interest-cloud');
    if (interestCloud) {
        interestCloud.innerHTML = '';
        const interests = data.interests || DEFAULT_DATA.interests;
        interests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = `interest-tag tag-${interest.size}`;
            tag.textContent = interest.name;
            interestCloud.appendChild(tag);
        });
    }

    // 8. 人生信条
    const mottoText = document.querySelector('.motto-text');
    if (mottoText) {
        mottoText.textContent = `" ${(data.motto || DEFAULT_DATA.motto)} "`;
    }
    const mottoSub = document.querySelector('.motto-sub');
    if (mottoSub) {
        mottoSub.textContent = `—— ${(data.mottoAuthor || DEFAULT_DATA.mottoAuthor)}`;
    }

    // 9. 联系方式
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
        contactGrid.innerHTML = '';
        const contacts = data.contact || DEFAULT_DATA.contact;
        contacts.forEach(c => {
            const a = document.createElement('a');
            a.href = c.link || '#';
            a.className = 'contact-item';
            a.innerHTML = `
                <div class="contact-icon">${c.icon}</div>
                <span>${c.name}</span>
            `;
            contactGrid.appendChild(a);
        });
    }

    // 10. 底部版权
    const footerSub = document.querySelector('.footer-sub');
    if (footerSub) {
        footerSub.textContent = data.footerCopyright || DEFAULT_DATA.footerCopyright;
    }
}

// === 入场动画 ===
window.addEventListener('load', () => {
    // 优先从 data.json 加载已发布数据，失败则用 localStorage
    fetch('data.json?t=' + Date.now())
        .then(res => res.ok ? res.json() : null)
        .then(remoteData => {
            if (remoteData) {
                // 有远端数据，同步到 localStorage 并展示
                localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
                applyDataToPage(remoteData);
            } else {
                applyDataToPage();
            }
        })
        .catch(() => applyDataToPage());

    // 移除转场遮罩
    setTimeout(() => {
        const mask = document.getElementById('transitionMask');
        mask.classList.add('hide');
    }, 500);

    // 初始化速度线
    initSpeedLines();

    // 初始化面板观察器
    initPanelObserver();

    // 初始化技能条动画
    initSkillBars();

    // 初始化点击漫画效果
    initClickEffects();

    // 初始化鼠标跟随效果
    initMouseFollow();

    // 初始化兴趣标签随机旋转
    initInterestRotation();
});

// === 速度线绘制 ===
function initSpeedLines() {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('speedLines');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawSpeedLines();
    }

    function drawSpeedLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 80; i++) {
            const angle = (Math.PI * 2 / 80) * i + Math.random() * 0.1;
            const innerRadius = 100 + Math.random() * 200;
            const outerRadius = Math.max(canvas.width, canvas.height) * 0.8;

            const x1 = centerX + Math.cos(angle) * innerRadius;
            const y1 = centerY + Math.sin(angle) * innerRadius;
            const x2 = centerX + Math.cos(angle) * outerRadius;
            const y2 = centerY + Math.sin(angle) * outerRadius;

            ctx.globalAlpha = 0.3 + Math.random() * 0.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r1 = 200 + Math.random() * 300;
            const r2 = r1 + 50 + Math.random() * 100;

            const x1 = centerX + Math.cos(angle) * r1;
            const y1 = centerY + Math.sin(angle) * r1;
            const x2 = centerX + Math.cos(angle) * r2;
            const y2 = centerY + Math.sin(angle) * r2;

            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    resize();
    window.addEventListener('resize', resize);
}

// === 滚动面板观察器 ===
let skillBarNeedsUpdate = false;

function initPanelObserver() {
    const panels = document.querySelectorAll('.manga-panel');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.dataset.panel === '2') {
                    fillSkillBars();
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    panels.forEach(panel => observer.observe(panel));
}

// === 技能条动画 ===
function initSkillBars() {
    // 由 observer 触发
}

function fillSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach((fill, index) => {
        const level = fill.dataset.level;
        setTimeout(() => {
            fill.style.setProperty('--level', level + '%');
            fill.classList.add('filled');
        }, index * 150);
    });
}

// === 点击漫画音效 ===
function initClickEffects() {
    const sfxList = [
        'バン!', 'ドン!', 'カッ!', 'ガッ!', 'パン!', 'ボム!', 'ヒッ!',
        'BANG!', 'POW!', 'WHAM!', 'ZAP!', 'CRACK!', 'BOOM!'
    ];

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.manga-panel') || target.closest('.hero-section') || target.closest('.contact-item')) {
            const sfx = document.createElement('div');
            sfx.className = 'click-sfx';
            sfx.textContent = sfxList[Math.floor(Math.random() * sfxList.length)];

            const rotation = -15 + Math.random() * 30;
            const size = 20 + Math.random() * 20;

            sfx.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-family: 'Bangers', cursive;
                font-size: ${size}px;
                color: #f5f5f5;
                transform: rotate(${rotation}deg) translate(-50%, -50%);
                z-index: 100;
                pointer-events: none;
                animation: clickSfxAnim 0.8s ease-out forwards;
                white-space: nowrap;
            `;

            document.body.appendChild(sfx);
            setTimeout(() => sfx.remove(), 800);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes clickSfxAnim {
            0% { opacity: 1; transform: rotate(var(--rot, 0deg)) scale(0.3) translate(-50%, -50%); }
            50% { opacity: 1; transform: rotate(var(--rot, 0deg)) scale(1.2) translate(-50%, -50%); }
            100% { opacity: 0; transform: rotate(var(--rot, 0deg)) scale(1.5) translate(-50%, -50%); }
        }
    `;
    document.head.appendChild(style);
}

// === 鼠标跟随 ===
function initMouseFollow() {
    let lastX = 0, lastY = 0, isMoving = false, moveTimeout;

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        lastX = e.clientX;
        lastY = e.clientY;

        if (speed > 30 && !isMoving) {
            isMoving = true;
            createMotionTrail(e.clientX, e.clientY, dx, dy);
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => { isMoving = false; }, 100);
        }
    });
}

function createMotionTrail(x, y, dx, dy) {
    const trail = document.createElement('div');
    const angle = Math.atan2(dy, dx);
    trail.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: ${Math.abs(dx) * 0.5}px; height: 2px;
        background: rgba(255, 255, 255, 0.6);
        transform: rotate(${angle}rad); transform-origin: left center;
        z-index: 50; pointer-events: none;
        animation: trailFade 0.3s ease-out forwards;
    `;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 300);
}

const trailStyle = document.createElement('style');
trailStyle.textContent = `@keyframes trailFade { 0% { opacity: 0.6; } 100% { opacity: 0; width: 0; } }`;
document.head.appendChild(trailStyle);

// === 名字悬停动画 ===
const heroNameEl = document.getElementById('heroName');
if (heroNameEl) {
    heroNameEl.addEventListener('mouseenter', () => {
        const chars = heroNameEl.querySelectorAll('.name-char');
        chars.forEach((char, i) => {
            setTimeout(() => {
                char.style.animation = 'none';
                char.offsetHeight;
                char.style.animation = 'charBounce 0.4s ease-out';
            }, i * 80);
        });
    });
}

const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes charBounce {
        0% { transform: translateY(0); }
        40% { transform: translateY(-15px); }
        70% { transform: translateY(5px); }
        100% { transform: translateY(0); }
    }
`;
document.head.appendChild(bounceStyle);

// === 兴趣标签随机旋转 ===
function initInterestRotation() {
    const tags = document.querySelectorAll('.interest-tag');
    tags.forEach(tag => {
        const rotation = -5 + Math.random() * 10;
        tag.style.transform = `rotate(${rotation}deg)`;
    });
}

// === 面板出场延迟 ===
document.querySelectorAll('.manga-panel').forEach((panel, index) => {
    panel.style.transitionDelay = `${index * 0.15}s`;
});

// === 联系方式点击处理（委托方式，兼容动态渲染） ===
document.addEventListener('click', (e) => {
    const contactItem = e.target.closest('.contact-item');
    if (contactItem) {
        e.preventDefault();
        // 如果有真实链接（非 #），则跳转
        const href = contactItem.getAttribute('href');
        if (href && href !== '#') {
            window.open(href, '_blank');
        } else {
            // 没有真实链接时显示漫画震动效果
            contactItem.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => { contactItem.style.animation = ''; }, 500);
        }
    }
});

// === 滚动漫画震动 ===
let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        const visiblePanels = document.querySelectorAll('.manga-panel.visible');
        visiblePanels.forEach(panel => {
            panel.style.transform = 'translateY(-2px)';
            setTimeout(() => { panel.style.transform = 'translateY(0)'; }, 100);
        });
    }, 50);
});

// === 黑白背景脉动 ===
function animateBackground() {
    let hueShift = 0;
    setInterval(() => {
        hueShift += 0.5;
        const brightness = 10 + Math.sin(hueShift * 0.01) * 2;
        document.body.style.background = `hsl(0, 0%, ${brightness}%)`;
    }, 100);
}
animateBackground();

// === 监听 localStorage 变化（跨标签页同步） ===
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        applyDataToPage();
        setTimeout(() => {
            fillSkillBars();
            initInterestRotation();
        }, 100);
    }
});

// === 后台入口：连续点击底部5次显示 ===
const footerSubEl = document.getElementById('footerSub');
const adminEntryEl = document.getElementById('adminEntry');
let adminClickCount = 0;
let adminClickTimer = null;

if (footerSubEl && adminEntryEl) {
    footerSubEl.addEventListener('click', () => {
        adminClickCount++;
        clearTimeout(adminClickTimer);
        adminClickTimer = setTimeout(() => { adminClickCount = 0; }, 2000);

        if (adminClickCount >= 5) {
            adminEntryEl.classList.add('show');
            adminClickCount = 0;
        }
    });
}