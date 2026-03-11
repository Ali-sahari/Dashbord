const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && entry !== 'node_modules' && !entry.startsWith('.')) {
            processDirectory(fullPath);
        } else if (stat.isFile() && fullPath.endsWith('.html')) {
            addScriptToHtml(fullPath);
        }
    }
}

function addScriptToHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if script is already added to avoid duplicates
    if (content.includes('himaya.js')) {
        console.log(`Skipping (already contains himaya.js): ${filePath}`);
        return;
    }
    
    // Calculate the relative path from this HTML file to the root himaya.js
    const depth = filePath.split(path.sep).length - 1; // Assuming script is run from project root
    let relativePath = '';
    
    // If it's in the root dir (depth 0), it's just ./himaya.js
    // If it's in UserDashboard/home.html (depth 1), it's ../himaya.js
    if (depth === 0) {
        relativePath = './himaya.js';
    } else {
        relativePath = '../'.repeat(depth) + 'himaya.js';
    }

    const scriptTag = `\n    <script src="${relativePath}"></script>`;
    
    // Find <head> and insert script immediately after it
    if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>${scriptTag}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    } else {
        console.log(`Warning: No <head> tag found in ${filePath}`);
    }
}

// Start processing from current directory
processDirectory('.');
console.log('Script execution finished.');
