const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (127.0.0.1) and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        // Favor 10.x.x.x or 192.168.x.x or 172.16-31.x.x
        if (iface.address.startsWith('10.') || iface.address.startsWith('192.168.') || iface.address.startsWith('172.')) {
            return iface.address;
        }
      }
    }
  }
  return 'localhost';
}

const envPath = path.join(__dirname, '..', 'artifacts', 'todo-app', '.env');
const currentIP = getLocalIP();
const newUrl = `EXPO_PUBLIC_API_URL=http://${currentIP}:5000`;

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
        if (content.includes('EXPO_PUBLIC_API_URL')) {
            content = content.replace(/EXPO_PUBLIC_API_URL=http:\/\/[0-9.]+:5000/, newUrl);
        } else {
            content += `\n${newUrl}\n`;
        }
    } else {
        content = `${newUrl}\n`;
    }
    
    fs.writeFileSync(envPath, content);
    console.log(`Successfully updated .env with IP: ${currentIP}`);
} catch (err) {
    console.error('Failed to update .env:', err);
    process.exit(1);
}
