const fs = require('fs');
const path = require('path');

const dir = './src';
const target1 = "|| 'http://localhost:8080'";
const target2 = "|| 'http://127.0.0.1:8080'";
const replacement = "|| 'https://uwoconnectforrb-743928421487.asia-south1.run.app'";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
let modifiedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(target1) || content.includes(target2)) {
    content = content.split(target1).join(replacement);
    content = content.split(target2).join(replacement);
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});
console.log(`Modified ${modifiedCount} files.`);
