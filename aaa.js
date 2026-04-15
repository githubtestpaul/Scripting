// Loon 加强版去广告 - x13k6u5a738rw.com:58011
var body = $response.body;

if (!body || !/<html|<!doctype/i.test(body)) {
    $done({ body });
    return;
}

console.log('【x13k净化】脚本已执行，body长度：' + body.length);

// 更全面的 CSS
const css = `<style id="adblock-css">
#notice_container,.event-notice,.application-popup,.popup,.modal,.overlay,
.addbox,.infomation,.post-content,.ads,.ad-box,.ad-container,.advert,
.list-sec-top,.list-sec,#copy-img,.recommend,.friend-link,
.footer,footer,.foot,.bottom-bar,
iframe[src*="yandex"],iframe[src*="google"],iframe[src*="doubleclick"],iframe[src*="ads"],
.video-item:has(a.gotoclick),.video-item:has(a.tjtagmanager),
.video-item:has(a[adv_id]),.video-item:has([class*="ad"]),
div[class*="ad"], div[id*="ad"]
{display:none!important;height:0!important;overflow:hidden!important;visibility:hidden!important;}
</style>`;

// 更强力的 JS
const js = `<script id="adblock-js">
(function(){
    console.log('【x13k净化】JS注入成功');

    function removeAds() {
        console.log('【x13k净化】开始清理广告...');

        // 强制移除所有广告视频项
        document.querySelectorAll('.video-item, .list-item, .item').forEach(item => {
            const a = item.querySelector('a');
            if (a) {
                const href = a.href || '';
                const cls = a.className || '';
                if (cls.includes('gotoclick') || cls.includes('tjtagmanager') || 
                    a.hasAttribute('adv_id') || /ad|tj|promo|click|stats|go/i.test(href + cls)) {
                    console.log('移除广告项:', href);
                    item.remove();
                }
            }
        });

        // 大范围移除
        const badSelectors = ["#notice_container",".event-notice",".application-popup",".addbox",".infomation",".post-content",
            ".list-sec-top",".list-sec","#copy-img",".footer","footer",".popup",".modal",".overlay",".ad",".ads"];
        
        badSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                console.log('移除元素:', sel);
                el.remove();
            });
        });

        // 移除广告脚本
        document.querySelectorAll('script').forEach(s => {
            const src = s.src || s.getAttribute('src') || '';
            if (/stats\.kwvprfcr|yandex|googletagmanager|gtag|doubleclick|ads|promo|analytics/i.test(src)) {
                console.log('移除广告脚本:', src);
                s.remove();
            }
        });

        // 激进清理：所有固定/绝对定位且包含广告关键词的层
        document.querySelectorAll('div, section').forEach(el => {
            const style = el.getAttribute('style') || '';
            const text = el.innerText || '';
            if ((style.includes('fixed') || style.includes('absolute')) && 
                /广告|下载|安装|APP|立即观看|点击|赞助|赞助商/i.test(text)) {
                el.remove();
            }
        });
    }

    // 多时机执行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", removeAds);
    } else {
        removeAds();
    }
    setTimeout(removeAds, 500);
    setTimeout(removeAds, 1500);
    setTimeout(removeAds, 3000);
    setTimeout(removeAds, 6000);
    setTimeout(removeAds, 10000);
})();
<\/script>`;

// 注入
body = body.replace(/<\/head>/i, css + '</head>');
body = body.replace(/<\/body>/i, js + '</body>');

// 强力清理脚本标签
body = body.replace(/<script[^>]*?(stats\.kwvprfcr\.xyz|yandex\.ru|googletagmanager|gtag|doubleclick|kwvprfcr)[^>]*>[\s\S]*?<\/script>/gi, '');

$done({ body });