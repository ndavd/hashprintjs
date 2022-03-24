const isNode = (typeof window === "undefined" && typeof process === "object");

type colorValues = 0 | 1 | 2;

type allowedAlgs = "SHA-256" | "SHA-384" | "SHA-512";

interface Opts {
  data:        string;
  size?:       number;
  bg?:         string;
  saturation?: number;
  lightness?:  number;
  likeness?:   [number, number];
  algorithm:   allowedAlgs;
}

// Compute SHA-256 hash
const digestData = async (d: string, hashFunction: allowedAlgs): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(d);

  let hash;
  if (isNode) {
    hash = await eval("require")("crypto").webcrypto.subtle.digest(hashFunction, data);
  } else {
    hash = await crypto.subtle.digest(hashFunction, data);
  }

  return hash;
}

const GenerateHashprint = async (opts: Opts): Promise<string> => {

  // Set defaults
  opts.saturation = opts.saturation || 0.7;
  opts.lightness  = opts.lightness  || 0.5;
  opts.bg         = opts.bg         || "#00000000";
  opts.algorithm  = opts.algorithm  || "SHA-256";

  if (opts.size) {
    opts.size = Math.ceil(opts.size / 7) * 7;
  } else {
    opts.size = 140;
  }

  if (opts.likeness && opts.likeness[0] + opts.likeness[1] <= 1) {
    opts.likeness = opts.likeness;
  } else {
    opts.likeness = [0.50, 0.25];
  }

  // Get the hash
  const digest = await digestData(opts.data, opts.algorithm);
  const view = new Uint8Array(digest);

  // Get the grid values
  let a: colorValues[] = [];
  // (50% chance it's 1, 25% it's 2, 25% it's 0)
  for (let i = 0; i < 28; i++) {
    if (view[i] <= (256 * opts.likeness[0])) {
      a.push(1);
    } else if (view[i] <= (256 * (opts.likeness[0] + opts.likeness[1]))) {
      a.push(2);
    } else {
      a.push(0);
    }
  }

  const active: colorValues[] = [
    a[0],  a[1],  a[2],  a[3],  a[2],  a[1],  a[0],
    a[4],  a[5],  a[6],  a[7],  a[6],  a[5],  a[4],
    a[8],  a[9],  a[10], a[11], a[10], a[9],  a[8],
    a[12], a[13], a[14], a[15], a[14], a[13], a[12],
    a[16], a[17], a[18], a[19], a[18], a[17], a[16],
    a[20], a[21], a[22], a[23], a[22], a[21], a[20],
    a[24], a[25], a[26], a[27], a[26], a[25], a[24],
  ];

  // Get the hue values from the last 4 bytes (2 bytes per hue)
  // byte1 + byte2 -- 256
  //             X -- 360
  const hue1 = ((view[28] + view[29]) * 360) / 256;
  const hue2 = ((view[30] + view[31]) * 360) / 256;

  // Create canvas
  let canvas;
  if (isNode) {
    canvas = eval("require")('canvas').createCanvas(opts.size, opts.size);
  } else {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = opts.size;
  }
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = opts.bg;
  ctx.strokeStyle = "#00000000";
  ctx.fillRect(
    0, 0, opts.size, opts.size
  );

  // Draw hashprint
  const l = opts.size / 7;

  for (let i = 0; i < active.length; i++) {
    if (active[i] === 0) continue;

    ctx.fillStyle =
      `hsl(${(active[i] === 1)?hue1:hue2}, ${opts.saturation * 100}%, ${opts.lightness * 100}%)`;
    ctx.fillRect(
      (i % 7) * l,
      Math.floor(i / 7) * l,
      l, l
    );
  }

  return canvas.toDataURL();
}

// export default GenerateHashprint;
module.exports = GenerateHashprint
