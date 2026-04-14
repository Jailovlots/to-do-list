import { execSync } from 'child_process';

const ports = [5000, 8081];

console.log('Cleaning up ports:', ports.join(', '));

ports.forEach(port => {
  try {
    const cmd = `netstat -ano | findstr :${port}`;
    const output = execSync(cmd).toString();
    const lines = output.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0' && pid !== process.pid.toString()) {
        pids.add(pid);
      }
    });

    pids.forEach(pid => {
      try {
        console.log(`Killing process ${pid} on port ${port}...`);
        execSync(`taskkill /F /PID ${pid} /T`);
      } catch (e) {
        // Ignore if process already gone
      }
    });
  } catch (e) {
    // findstr returns 1 if no matches, which is fine
  }
});

console.log('Cleanup complete.');
process.exit(0);
