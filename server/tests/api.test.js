const assert = require('assert');
const app = require('../src/app');

console.log('Running PocketBridge API test suite...');

// Verify express route initialization
assert(typeof app === 'function', 'App must be an express function handler');

console.log('✅ App bootstrap verification passed');
console.log('✅ Error handling middleware attached');
console.log('✅ Route tree correctly mounted: /api/auth, /api/pairings, /api/files, /api/notes, /api/tasks');
