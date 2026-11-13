#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');

const CONFIG_PATH = path.join(__dirname, '.pocketbridge-config.json');

function getConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  }
  return { apiUrl: 'http://localhost:4000/api', token: null };
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

async function request(endpoint, method = 'GET', body = null) {
  const cfg = getConfig();
  const url = new URL(cfg.apiUrl + endpoint);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cfg.token ? { 'Authorization': `Bearer ${cfg.token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(json.error?.message || 'Request failed'));
          else resolve(json);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === '--help' || command === 'help') {
    console.log(`
PocketBridge CLI - Lightweight Local Companion
Usage:
  pocketbridge status          Check API health and active connection
  pocketbridge tasks list      List all tasks
  pocketbridge files list      List received files
  pocketbridge notes add <msg> Create a quick note
  pocketbridge set-token <tok> Set bearer authentication token
`);
    return;
  }

  try {
    if (command === 'status') {
      const res = await request('/health');
      console.log('✅ PocketBridge API Status:', res.status, '| Service:', res.service);
    } else if (command === 'tasks' && args[1] === 'list') {
      const tasks = await request('/tasks');
      console.log(`Found ${tasks.length} tasks:`);
      tasks.forEach(t => console.log(` - [${t.status.toUpperCase()}] ${t.title} (Priority: ${t.priority})`));
    } else if (command === 'files' && args[1] === 'list') {
      const files = await request('/files');
      console.log(`Found ${files.length} files:`);
      files.forEach(f => console.log(` - ${f.original_name} (${(f.size_bytes/1024).toFixed(1)} KB) from ${f.source_device_name}`));
    } else if (command === 'notes' && args[1] === 'add') {
      const msg = args.slice(2).join(' ');
      if (!msg) throw new Error('Provide a note message');
      const note = await request('/notes', 'POST', { title: 'CLI Quick Note', body: msg });
      console.log('✅ Note created:', note.note_id);
    } else if (command === 'set-token') {
      const token = args[1];
      saveConfig({ ...getConfig(), token });
      console.log('✅ Token saved to local config.');
    } else {
      console.log(`Unknown command: ${command}. Type 'pocketbridge --help' for available commands.`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
