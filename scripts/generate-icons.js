import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function writeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcBuf = Buffer.alloc(4 + len);
    crcBuf.write(type, 0, 4, 'ascii');
    data.copy(crcBuf, 4);
    buf.writeUInt32BE(crc32(crcBuf), 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace
  const ihdrChunk = writeChunk('IHDR', ihdr);

  // Scanlines (Filter byte 0 + RGBA per pixel)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = writeChunk('IDAT', compressed);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate beautiful branded blue robot badge icons
function renderIcon(size, isMaskable = false) {
  return createPNG(size, size, (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Maskable padding: center content is safe within 80% circle
    const maxRadius = isMaskable ? w * 0.45 : w * 0.46;
    const cornerRadius = w * 0.22;

    // Squircle distance approx
    const absX = Math.abs(x - cx);
    const absY = Math.abs(y - cy);
    const boxDist = Math.max(absX, absY);

    if (dist > maxRadius && !isMaskable) {
      return [0, 0, 0, 0]; // Transparent outside rounded boundary
    }

    // Gradient background: from #2563eb (37, 99, 235) to #1d4ed8 (29, 78, 216)
    const t = (x + y) / (w + h);
    const bgR = Math.round(37 * (1 - t) + 15 * t);
    const bgG = Math.round(99 * (1 - t) + 23 * t);
    const bgB = Math.round(235 * (1 - t) + 66 * t);

    // Inner glowing ring
    const ringRadius = w * 0.32;
    if (Math.abs(dist - ringRadius) < w * 0.015) {
      return [96, 165, 250, 255]; // bright sky blue ring
    }

    // Robot head rectangle approx
    const headW = w * 0.38;
    const headH = w * 0.28;
    if (Math.abs(dx) < headW / 2 && Math.abs(dy) < headH / 2) {
      // Eyes
      const eyeDx = Math.abs(dx) - headW * 0.22;
      const eyeDy = dy + headH * 0.1;
      const eyeDist = Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy);
      if (eyeDist < headW * 0.09) {
        return [56, 189, 248, 255]; // light cyan eye
      }

      // Smile
      const smileDy = dy - headH * 0.18;
      if (Math.abs(smileDy) < headH * 0.06 && Math.abs(dx) < headW * 0.25) {
        return [56, 189, 248, 255];
      }

      return [255, 255, 255, 240]; // White head
    }

    // Antenna
    if (Math.abs(dx) < w * 0.015 && dy < -headH / 2 && dy > -headH * 0.8) {
      return [255, 255, 255, 255];
    }
    const antennaDist = Math.sqrt(dx * dx + (dy + headH * 0.85) * (dy + headH * 0.85));
    if (antennaDist < w * 0.035) {
      return [96, 165, 250, 255];
    }

    return [bgR, bgG, bgB, 255];
  });
}

const outDir = path.resolve('./public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'icon-192.png'), renderIcon(192, false));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), renderIcon(512, false));
fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), renderIcon(512, true));

console.log('Generated PNG icons successfully!');
