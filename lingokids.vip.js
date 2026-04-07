# ====================== JS 脚本开始（直接把下面整个JS内容粘贴到上面 script-path= 后面，或单独保存为 .js 文件） ======================
# 如果内嵌，直接把下面 JS 代码整个复制到 script-path= 后面的位置（Loon 支持内嵌）

const url = $request.url;
if (url.includes("manhuache.com")) {
    let body = $response.body;

    // 1. 阻止常见自动跳转代码
    body = body.replace(/location\.href\s*=\s*['"].*?['"]/gi, 'console.log("跳转已被阻止")');
    body = body.replace(/window\.location\s*=\s*['"].*?['"]/gi, 'console.log("跳转已被阻止")');
    body = body.replace(/window\.open\s*\(/gi, 'console.log("弹窗已被阻止")(');

    // 2. 移除定时器跳转（setTimeout / setInterval）
    body = body.replace(/setTimeout\s*\(\s*function\s*\(\)\s*\{[^}]*location[^}]*\}\s*,\s*\d+\)/gi, 'console.log("定时跳转已被阻止")');
    body = body.replace(/setInterval\s*\(\s*function\s*\(\)\s*\{[^}]*location[^}]*\}/gi, 'console.log("定时跳转已被阻止")');

    // 3. 隐藏或删除常见广告元素（根据实际页面结构可继续补充）
    body = body.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');  // 移除 iframe 广告
    body = body.replace(/<div[^>]*class=["'][^"']*ad[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');  // 移除含 ad 类的 div
    body = body.replace(/<script[^>]*src=["'][^"']*(ad|pop|union|google|baidu)[^"']*["'][^>]*><\/script>/gi, '');  // 移除广告脚本

    // 4. 注入 CSS 隐藏广告位
    const css = `
        <style>
        div[class*="ad"], div[id*="ad"], iframe, .popup, .float-ad, [style*="position: fixed"] { display: none !important; visibility: hidden !important; }
        </style>
    `;
    if (body.includes("</head>")) {
        body = body.replace("</head>", css + "</head>");
    } else if (body.includes("<body")) {
        body = body.replace("<body", "<head>" + css + "</head><body");
    }

    $done({body: body});
} else {
    $done({});
}