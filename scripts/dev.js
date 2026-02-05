#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Fullstack Development Servers...\n');

// Start backend first
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(process.cwd(), 'packages/backend'),
  stdio: 'inherit',
  shell: true
});

backend.stdout?.on('data', (data) => {
  const output = data.toString();
  if (output.includes('server running') || output.includes('listening')) {
    console.log('✅ Backend started successfully');
    
    // Start frontend after backend is ready
    setTimeout(() => {
      console.log('🎯 Starting Frontend...\n');
      const frontend = spawn('npm', ['run', 'dev'], {
        cwd: path.join(process.cwd(), 'packages/frontend'),
        stdio: 'inherit',
        shell: true
      });
      
      frontend.on('close', (code) => {
        console.log(`Frontend process exited with code ${code}`);
        process.exit(code);
      });
    }, 1000);
  }
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  process.exit(0);
});