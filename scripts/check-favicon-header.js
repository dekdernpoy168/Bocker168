import fs from 'fs';
import path from 'path';

const dest = path.join(process.cwd(), 'public', 'favicon.png');
const buffer = Buffer.alloc(8);
const fd = fs.openSync(dest, 'r');
fs.readSync(fd, buffer, 0, 8, 0);
fs.closeSync(fd);

console.log('Header:', buffer.toString('hex'));
