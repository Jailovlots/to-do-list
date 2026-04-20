import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Robustly detects the local LAN IP address.
 * Prioritizes physical adapters (Wi-Fi, Ethernet) and filters out
 * virtual ones (WSL, Hyper-V, vEthernet, VirtualBox).
 */
function getLocalIp() {
  if (process.env.OVERRIDE_IP) {
    console.log(`⚠️ Using OVERRIDE_IP: ${process.env.OVERRIDE_IP}`);
    return process.env.OVERRIDE_IP;
  }

  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(interfaces)) {
    const isVirtual = /vpn|virtual|vbox|vmware|vethernet|wsl|docker|hyper-v/i.test(name);
    
    for (const iface of interfaces[name]) {
      // Filter for IPv4 and non-internal
      if (iface.family === 'IPv4' && !iface.internal) {
        const isLikelyPhysical = /wi-fi|ethernet|eth|en0|wlan/i.test(name.toLowerCase());
        
        candidates.push({
          address: iface.address,
          name: name,
          priority: (isLikelyPhysical ? 10 : 0) - (isVirtual ? 20 : 0)
        });
      }
    }
  }

  // Sort by priority (higher first)
  candidates.sort((a, b) => b.priority - a.priority);

  if (candidates.length > 0) {
    const selected = candidates[0];
    if (selected.priority < 0) {
      console.log(`⚠️ Warning: Selected IP might be virtual (${selected.name}: ${selected.address})`);
    }
    return selected.address;
  }

  return 'localhost';
}

const localIp = getLocalIp();
console.log(`📡 Detected LAN IP: ${localIp}`);

const envFiles = [
  path.join(rootDir, 'artifacts', 'todo-app', '.env'),
];

for (const envPath of envFiles) {
  if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    const apiUrl = `http://${localIp}:5000/api`;
    
    if (content.match(/EXPO_PUBLIC_API_URL=.*/)) {
      content = content.replace(/EXPO_PUBLIC_API_URL=.*/, `EXPO_PUBLIC_API_URL=${apiUrl}`);
    } else {
      content += `\nEXPO_PUBLIC_API_URL=${apiUrl}`;
    }
    
    fs.writeFileSync(envPath, content);
    console.log(`✅ Updated ${path.basename(path.dirname(envPath))}/.env -> ${apiUrl}`);
  } else {
    // Create it if it doesn't exist
    const content = `EXPO_PUBLIC_API_URL=http://${localIp}:5000/api\n`;
    fs.mkdirSync(path.dirname(envPath), { recursive: true });
    fs.writeFileSync(envPath, content);
    console.log(`✨ Created ${path.basename(path.dirname(envPath))}/.env -> ${localIp}`);
  }
}

