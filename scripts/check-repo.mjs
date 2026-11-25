const res = await fetch('https://api.github.com/repos/pravesh62689/shiftandtip-assets', {
  headers: { 'User-Agent': 'Node-Fetch' }
});
const data = await res.json();
console.log('STATUS:', res.status);
console.log('EXISTS:', res.status === 200);
console.log('PRIVATE:', data.private);
console.log('MESSAGE:', data.message || 'OK');
