import { execSync } from 'node:child_process';

console.log('=== Running recheck-data ===');
try {
  execSync('node scripts/pw/recheck-data.mjs', { stdio: 'inherit' });
  console.log('✓ recheck-data completed successfully.');
} catch (err) {
  console.error('✗ recheck-data failed:', err.message);
  process.exit(1);
}
