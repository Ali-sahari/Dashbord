const fs = require('fs');
const path = require('path');

// 1. Rename files
if (fs.existsSync('index.html')) fs.renameSync('index.html', 'admin.html');
if (fs.existsSync('login.html')) fs.renameSync('login.html', 'index.html');

// 2. Replace in adminDashbord/*.html
const adminDir = 'adminDashbord';
if (fs.existsSync(adminDir)) {
    const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));
    for (const file of files) {
        const fPath = path.join(adminDir, file);
        let content = fs.readFileSync(fPath, 'utf8');
        let edited = false;
        if (content.includes('href="../index.html"')) {
            content = content.replace(/href="\.\.\/index\.html"/g, 'href="../admin.html"');
            edited = true;
        }
        if (content.includes('href="../login.html"')) {
            content = content.replace(/href="\.\.\/login\.html"/g, 'href="../index.html"');
            edited = true;
        }
        if (edited) fs.writeFileSync(fPath, content, 'utf8');
    }
}

// 3. Replace in admin.html
if (fs.existsSync('admin.html')) {
    let adminContent = fs.readFileSync('admin.html', 'utf8');
    adminContent = adminContent.replace(/window\.location\.href = "login\.html";/g, 'window.location.href = "index.html";');
    adminContent = adminContent.replace(/href="\.\/index\.html"/g, 'href="./admin.html"');
    fs.writeFileSync('admin.html', adminContent, 'utf8');
}

// 4. Replace in index.html (new login)
if (fs.existsSync('index.html')) {
    let loginContent = fs.readFileSync('index.html', 'utf8');
    loginContent = loginContent.replace(/window\.location\.href = 'index\.html';/g, "window.location.href = 'admin.html';");
    fs.writeFileSync('index.html', loginContent, 'utf8');
}

// 5. Replace in main.js
const mainJsPath = path.join('adminDashbord', 'main.js');
if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');
    mainJs = mainJs.replace(/'\.\.\/login\.html'/g, "'../index.html'");
    mainJs = mainJs.replace(/'login\.html'/g, "'index.html'");
    fs.writeFileSync(mainJsPath, mainJs, 'utf8');
}

// 6. Replace in script.js
const scriptJsPath = path.join('UserDashboard', 'script.js');
if (fs.existsSync(scriptJsPath)) {
    let scriptJs = fs.readFileSync(scriptJsPath, 'utf8');
    scriptJs = scriptJs.replace(/"\.\.\/login\.html"/g, '"../index.html"');
    fs.writeFileSync(scriptJsPath, scriptJs, 'utf8');
}

console.log('Update complete.');
