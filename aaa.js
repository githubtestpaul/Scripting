// Loon 去广告脚本 - x13k6u5a738rw.com:58011
// 作者：Grok 基于你原脚本优化

var body = $response.body;

if (!body || !/<!doctype|<html/i.test(body)) {
    $done({ body: body });
    return;
}

// ==================== 针对该网站的 CSS 规则 ====================
const css = `<style id="adblock-css">
/* 开屏弹窗、通知 */
#notice_container, .event-notice, .application-popup, .popup, .modal,

/* 广告栏、底部横条、友情链接、信息栏 */
.addbox, .infomation, .post-content, .ads, .ad-box,

/* 详情页广告、推荐应用、分享横幅 */
.list-sec-top, .list-sec, #copy-img,

/* 整个页脚（大事记、领现金、合作等） */
.footer, .foot, footer,

/* 统计和广告 iframe */
iframe[src*="yandex"], iframe[src*="google"], iframe[src*="doubleclick"],
iframe[src*="ads"], iframe[width="100%"][height="250"]

/* 列表页广告条目 */
.video-item:has(a.gotoclick), .video-item:has(a.tjtagmanager), 
.video-item:has(a[adv_id]), .video-item:has([class*="ad"])
{display:none!important; height:0!important; overflow:hidden!important; visibility:hidden!important;}
</style>`;

// ==================== 针对该网站的 JS 清理逻辑 ====================
const js = `<script id="adblock-js">
(function(){
    function removeAds() {
        // 移除广告视频项
        document.querySelectorAll('.video-item').forEach(function(item) {
            var link = item.querySelector('a');
            if (link && (
                link.classList.contains('gotoclick') ||
                link.classList.contains('tjtagmanager') ||
                link.hasAttribute('adv_id') ||
                /ad|tj|promo|click/i.test(link.href || '')
            )) {
                item.remove();
            }
        });

        // 移除各类弹窗和广告容器
        const selectors = [
            "#notice_container", ".event-notice", ".application-popup",
            ".addbox", ".infomation", ".post-content", ".list-sec-top",
            ".list-sec", "#copy-img", ".footer", "footer"
        ];
        
        selectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                el.remove();
            });
        });

        // 移除可疑广告脚本
        document.querySelectorAll('script').forEach(function(s) {
            var src = s.getAttribute('src') || '';
            if (src.includes('stats.kwvprfcr.xyz') || 
                src.includes('yandex.ru') || 
                src.includes('googletagmanager') || 
                src.includes('gtag/js') ||
                src.includes('doubleclick') ||
                /ad|promo|analytics/i.test(src)) {
                s.remove();
            }
        });

        // 额外清理可能出现的浮动广告
        document.querySelectorAll('div[style*="fixed"], div[style*="absolute"], .fixed, .float').forEach(function(el) {
            if (el.innerText.length < 500 && /广告|下载|app|install/i.test(el.innerText)) {
                el.remove();
            }
        });
    }

    // 执行时机
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", removeAds);
    } else {
        removeAds();
    }
    
    setTimeout(removeAds, 800);
    setTimeout(removeAds, 2000);
    setTimeout(removeAds, 5000);
})();
<\/script>`;

// 注入 CSS 和 JS
body = body.replace(/<\/head>/i, css + '</head>');
body = body.replace(/<\/body>/i, js + '</body>');

// 额外清理残留的广告脚本
body = body.replace(/<script[^>]*?(stats\.kwvprfcr\.xyz|yandex\.ru|googletagmanager|gtag|doubleclick)[^>]*>[\s\S]*?<\/script>/gi, '');
body = body.replace(/<script[^>]*src=["'][^"']*(stats\.kwvprfcr|yandex|gtag|doubleclick)[^"']*["'][^>]*>/gi, '');

$done({ body: body });