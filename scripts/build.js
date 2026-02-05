#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', command], {
      cwd,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function buildAll() {
  console.log('🏗️  Building Fullstack Application...\n');
  
  try {
    // Build backend first
    console.log('📦 Building Backend...');
    await runCommand('build', path.join(process.cwd(), 'packages/backend'));
    console.log('✅ Backend built successfully\n');
    
    // Build frontend
    console.log('🎨 Building Frontend...');
    await runCommand('build', path.join(process.cwd(), 'packages/frontend'));
    console.log('✅ Frontend built successfully\n');
    
    console.log('🎉 Fullstack application built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildAll();