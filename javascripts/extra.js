var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        // 这里改变鼠标指针的颜色 由svg生成
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();

// 生成随机颜色
function randomColor() {
    const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 生成烟花效果
function createFirework(x, y) {
    const fireworkContainer = document.createElement('div');
    fireworkContainer.classList.add('fireworks');
    fireworkContainer.style.left = `${x}px`;
    fireworkContainer.style.top = `${y}px`;
    document.body.appendChild(fireworkContainer);

    for (let i = 0; i < 25; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.backgroundColor = randomColor();
        firework.style.width = '5px';
        firework.style.height = '5px';
        firework.style.left = `${Math.random() * 80 - 50}px`;
        firework.style.top = `${Math.random() * 80 - 50}px`;
        firework.style.animation = `firework 1s ease-out forwards, fall 1s ${Math.random() * 0.5}s forwards`;
        fireworkContainer.appendChild(firework);
    }

    setTimeout(() => {
        fireworkContainer.remove();
    }, 300);
}
// 监听单击事件
document.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY + window.scrollY;
    createFirework(x, y);
});



// 监听图片放大事件
document.querySelectorAll('.zoom').forEach(item => {
    item.addEventListener('click', function () {
        this.classList.toggle('image-zoom-large');
    })
});

// 监听滚动条事件
document.addEventListener('scroll', function () {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${scrolled}%`;
});

// 监听页面可见性变化事件
document.addEventListener("DOMContentLoaded", function () {
    let originalTitle = document.title; // 存储原始标题
    const awayTitle = "跑哪去惹(*´･д･`)"; // 当用户离开页面时显示的标题
    // 监听页面是否可见
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            document.title = awayTitle; // 当页面失去焦点时更改标题
        } else {
            // 当用户回到页面时恢复标题并开始每0.5秒更新一次
            document.title = originalTitle; // 恢复标题
        }
    });
    setInterval(function () {
        // 获取当前页面的完整 URL
        if (!document.hidden){
            originalTitle = document.title;
        } 
    }, 1000);
});



// 页面访问记录
document.addEventListener("DOMContentLoaded", function () {
    // 获取当前页面的完整 URL
    const currentUrl = document.location.href;
    const currentPath = document.location.pathname;
    // console.log("Current URL:", currentUrl, currentPath);

    // 获取最后访问的页面 URL
    const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");

    // 检查是否在主页
    const isHomePage = currentPath === '/';

    // 如果在主页、最后访问的 URL 存在且不等于当前 URL（规避死循环），跳转到最后访问的页面
    if (isHomePage && lastVisitedUrl && lastVisitedUrl !== currentUrl) {
        document.location.href = lastVisitedUrl;
    }

    // 每隔1秒检查当前 URL 并更新 lastVisitedUrl
    setInterval(function () {
        // 获取当前页面的完整 URL
        const currentUrl = document.location.href;

        // 获取最后访问的页面 URL
        const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");

        // 如果当前 URL 与最后访问的 URL 不同，则更新 lastVisitedUrl
        if (currentUrl !== lastVisitedUrl) {
            localStorage.setItem("lastVisitedUrl", currentUrl);
        }
    }, 1000);
});
