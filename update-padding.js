const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'app', '(storefront)');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(targetDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // We find the first occurrence of className="..." that contains min-h-screen or min-h-[70vh] or bg-
  // Actually, we can just replace the first exact match of `pt-24`, `pt-28`, `pt-32`, or `pt-40` that doesn't have a colon before it.
  
  // This regex matches `className="... pt-32 ..."`
  content = content.replace(/className="([^"]*)"/g, (match, classString) => {
    if (classString.includes('min-h-') || classString.includes('bg-') || classString.includes('pt-24') || classString.includes('pt-28') || classString.includes('pt-32') || classString.includes('pt-40')) {
      // replace \bpt-XX\b where it is not preceded by :
      const newClassString = classString.replace(/(?<!:)\b(pt-24|pt-28|pt-32|pt-40)\b/g, (m) => {
        return `max-md:pt-0 ${m}`;
      });
      if (newClassString !== classString && !classString.includes('max-md:pt-0')) {
        changed = true;
        return `className="${newClassString}"`;
      }
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
