const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Fonts
  content = content.replace(/font-playfair/g, 'font-fredoka');
  content = content.replace(/font-inter/g, 'font-poppins');
  
  // Colors
  content = content.replace(/bg-sage/g, 'bg-primary');
  content = content.replace(/text-sage/g, 'text-primary');
  content = content.replace(/border-sage/g, 'border-primary');
  content = content.replace(/shadow-sage/g, 'shadow-primary');
  
  content = content.replace(/bg-mint-secondary/g, 'bg-secondary');
  content = content.replace(/text-mint-secondary/g, 'text-secondary');
  content = content.replace(/border-mint-secondary/g, 'border-secondary');
  content = content.replace(/bg-mint-primary/g, 'bg-secondary');
  
  if (f.includes('Hero.tsx')) {
    content = content.replace(/style=\{\{\s*backgroundImage[^}]+\}\}/g, '');
    content = content.replace(/className=\"absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat\"/g, '');
  }

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated classes in: ' + f);
  }
});
