#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dirsToClean = [
  'node_modules',
  'packages/frontend/node_modules',
  'packages/backend/node_modules',
  'packages/frontend/.next',
  'packages/backend/dist'
];

console.log('🧹 Cleaning fullstack application...\n');

dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${dir}`);
  } else {
    console.log(`⏭️  Skipped: ${dir} (not found)`);
  }
});

console.log('\n🎉 Clean completed!');