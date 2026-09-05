const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replacements
    content = content.replace(/Super Sweet & Bakers/g, 'Attock Cake Delight');
    content = content.replace(/Super Sweet and Bakers/g, 'Attock Cake Delight');
    content = content.replace(/Super Sweets & Bakers/g, 'Attock Cake Delight');
    content = content.replace(/Super Bakery/g, 'Attock Cake Delight');
    content = content.replace(/Super Sweet/g, 'Attock Cake Delight');
    
    // Exact word SUPER -> CAKE DELIGHT
    content = content.replace(/\bSUPER\b/g, 'CAKE DELIGHT');
    
    // Emails
    content = content.replace(/admin@superbakers\.online/g, 'admin@attockcakedelight.com');
    content = content.replace(/supersweetsbakers@gmail\.com/g, 'contact@attockcakedelight.com');
    
    // Wah Cantt -> Attock
    content = content.replace(/Wah Cantt/g, 'Attock');
    
    // Social Links
    content = content.replace(/https:\/\/www\.instagram\.com\/supersweetsbakers\/\?hl=en/g, '#');
    content = content.replace(/https:\/\/web\.facebook\.com\/p\/superSweetsBakers-61573401750486\/\?_rdc=1&_rdr#/g, '#');
    content = content.replace(/https:\/\/www\.tiktok\.com\/@super_sweets_bakers/g, '#');
    
    // Store names
    content = content.replace(/super-bakery-branch-storage/g, 'attock-cake-delight-branch-storage');
    content = content.replace(/@superbakery/g, '@attockcakedelight');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.md')) {
                replaceInFile(fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'src'));
console.log("Done replacing branding strings.");
