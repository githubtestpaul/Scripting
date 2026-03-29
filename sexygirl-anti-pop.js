// sexygirl-anti-pop.js
// 专为 https://sexygirl.cc 阻止广告弹窗、自动跳转和下载诱导

(function() {
    'use strict';

    console.log('🔒 [SexyGirl Anti-Pop] 防弹窗脚本已成功注入');

    // 1. 阻止 window.open 打开新页面
    const originalOpen = window.open;
    window.open = function(url) {
        if (url && (url.includes('lh2-lp.com') || url.includes('ey-lp-op') || url.includes('qr-lp-op') || url.includes('dl.php'))) {
            console.log('🚫 Blocked window.open → ' + url);
            return null;
        }
        return originalOpen.apply(this, arguments);
    };

    // 2. 阻止 location.href / location.replace 等跳转
    const originalLocation = Object.getOwnPropertyDescriptor(Window.prototype, 'location');
    Object.defineProperty(window, 'location', {
        set: function(value) {
            const str = String(value || '');
            if (str.includes('lh2-lp.com') || str.includes('ey-lp-op') || str.includes('qr-lp-op') || str.includes('dl.php')) {
                console.log('🚫 Blocked location redirect → ' + str);
                return;
            }
            return originalLocation.set.call(this, value);
        },
        get: function() {
            return originalLocation.get.call(this);
        }
    });

    // 3. 阻止可疑的 setTimeout / setInterval 跳转
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        if (typeof fn === 'function') {
            const fnStr = fn.toString().toLowerCase();
            if (fnStr.includes('location') || fnStr.includes('open') || fnStr.includes('dl.php')) {
                console.log('🚫 Blocked suspicious setTimeout redirect');
                return;
            }
        }
        return originalSetTimeout.apply(this, arguments);
    };

    // 4. 阻止 _blank 广告链接自动打开
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        if (target && target.tagName === 'A' && target.target === '_blank') {
            const href = target.href || '';
            if (href.includes('lh2-lp.com') || href.includes('ey-lp-op') || href.includes('qr-lp-op')) {
                e.preventDefault();
                console.log('🚫 Prevented _blank ad link');
            }
        }
    }, true);

})();