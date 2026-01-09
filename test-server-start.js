// Quick test to see where it hangs
console.log('1. Starting test...');
require('dotenv').config();
console.log('2. dotenv loaded');

console.log('3. Testing logger import...');
try {
  const logger = require('./dist/utils/logger.js');
  console.log('4. Logger imported successfully');
} catch (e) {
  console.error('4. Logger import failed:', e.message);
}

console.log('5. Testing database import...');
try {
  const db = require('./dist/config/database.js');
  console.log('6. Database imported successfully');
} catch (e) {
  console.error('6. Database import failed:', e.message);
}

console.log('7. Test complete');
