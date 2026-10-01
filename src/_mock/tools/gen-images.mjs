// 목업 fixture용 가짜 이미지 생성기. 실제 사진·브랜드 자산을 쓰지 않으려고 SVG 일러스트를 직접 그린다.
// 실행: node src/_mock/tools/gen-images.mjs  → src/_mock/assets/img/**
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');

const PALETTES = [
  { bg1: '#fde2e4', bg2: '#fad2e1', main: '#e4572e', sub: '#29335c', accent: '#f3a712', skin: '#ffd6a5' },
  { bg1: '#dbe7f0', bg2: '#c5d8e8', main: '#3a86ff', sub: '#1b263b', accent: '#ffbe0b', skin: '#f1dca7' },
  { bg1: '#e9f5db', bg2: '#cfe1b9', main: '#588157', sub: '#344e41', accent: '#e76f51', skin: '#ffe8d6' },
  { bg1: '#f1e9ff', bg2: '#dcd0ff', main: '#7b2cbf', sub: '#240046', accent: '#ff9e00', skin: '#ffd8be' },
  { bg1: '#fff3c4', bg2: '#ffe596', main: '#ef476f', sub: '#073b4c', accent: '#06d6a0', skin: '#ffe5d9' },
  { bg1: '#e0fbfc', bg2: '#c2dfe3', main: '#ee6c4d', sub: '#293241', accent: '#3d5a80', skin: '#f8e1c4' },
  { bg1: '#2b2d42', bg2: '#3d405b', main: '#ef233c', sub: '#edf2f4', accent: '#8d99ae', skin: '#ffd7ba' },
  { bg1: '#f8edeb', bg2: '#fcd5ce', main: '#264653', sub: '#2a9d8f', accent: '#e9c46a', skin: '#fae1dd' },
];

const svg = (w, h, p, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/></linearGradient>` +
  `<radialGradient id="spot" cx="0.5" cy="0.35" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/>` +
  `<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` +
  `<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#spot)"/>${body}</svg>`;

const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" fill="#000" opacity="0.15"/>`;

// 진열장 위 피규어 3개
function figureShelf(w, h, p) {
  const shelfY = h * 0.78;
  const fig = (x, s, color, hair) => {
    const y = shelfY;
    return (
      shadow(x, y, 55 * s) +
      `<rect x="${x - 34 * s}" y="${y - 150 * s}" width="${68 * s}" height="${150 * s}" rx="${22 * s}" fill="${color}"/>` +
      `<rect x="${x - 50 * s}" y="${y - 140 * s}" width="${16 * s}" height="${80 * s}" rx="${8 * s}" fill="${color}"/>` +
      `<rect x="${x + 34 * s}" y="${y - 140 * s}" width="${16 * s}" height="${80 * s}" rx="${8 * s}" fill="${color}"/>` +
      `<circle cx="${x}" cy="${y - 200 * s}" r="${52 * s}" fill="${p.skin}"/>` +
      `<path d="M${x - 54 * s} ${y - 205 * s} q${54 * s} ${-80 * s} ${108 * s} 0 q${-20 * s} ${-25 * s} ${-54 * s} ${-25 * s} q${-34 * s} 0 ${-54 * s} ${25 * s}z" fill="${hair}"/>` +
      `<circle cx="${x - 18 * s}" cy="${y - 195 * s}" r="${6 * s}" fill="${p.sub}"/>` +
      `<circle cx="${x + 18 * s}" cy="${y - 195 * s}" r="${6 * s}" fill="${p.sub}"/>` +
      `<path d="M${x - 12 * s} ${y - 172 * s} q${12 * s} ${10 * s} ${24 * s} 0" stroke="${p.sub}" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`
    );
  };
  return (
    `<rect x="0" y="${shelfY}" width="${w}" height="${h * 0.05}" fill="${p.sub}" opacity="0.85"/>` +
    `<rect x="0" y="${shelfY + h * 0.05}" width="${w}" height="${h}" fill="${p.sub}" opacity="0.25"/>` +
    fig(w * 0.25, 0.9, p.main, p.sub) +
    fig(w * 0.5, 1.15, p.accent, p.main) +
    fig(w * 0.75, 0.95, p.sub, p.accent)
  );
}

// 각진 메카닉 로봇
function mecha(w, h, p) {
  const cx = w / 2;
  const base = h * 0.86;
  return (
    shadow(cx, base, 170) +
    `<rect x="${cx - 95}" y="${base - 210}" width="70" height="210" rx="10" fill="${p.sub}"/>` +
    `<rect x="${cx + 25}" y="${base - 210}" width="70" height="210" rx="10" fill="${p.sub}"/>` +
    `<rect x="${cx - 110}" y="${base - 40}" width="100" height="40" rx="8" fill="${p.main}"/>` +
    `<rect x="${cx + 10}" y="${base - 40}" width="100" height="40" rx="8" fill="${p.main}"/>` +
    `<path d="M${cx - 130} ${base - 420} h260 l-30 200 h-200z" fill="${p.main}"/>` +
    `<rect x="${cx - 60}" y="${base - 380}" width="120" height="70" rx="8" fill="${p.accent}"/>` +
    `<rect x="${cx - 210}" y="${base - 420}" width="70" height="90" rx="14" fill="${p.sub}"/>` +
    `<rect x="${cx + 140}" y="${base - 420}" width="70" height="90" rx="14" fill="${p.sub}"/>` +
    `<rect x="${cx - 200}" y="${base - 330}" width="50" height="150" rx="12" fill="${p.main}"/>` +
    `<rect x="${cx + 150}" y="${base - 330}" width="50" height="150" rx="12" fill="${p.main}"/>` +
    `<rect x="${cx - 60}" y="${base - 530}" width="120" height="100" rx="18" fill="${p.sub}"/>` +
    `<path d="M${cx} ${base - 520} l-90 -70 l20 -5 l70 50 l70 -50 l20 5z" fill="${p.accent}"/>` +
    `<rect x="${cx - 40}" y="${base - 495}" width="80" height="26" rx="6" fill="${p.accent}"/>` +
    `<rect x="${cx - 30}" y="${base - 489}" width="60" height="14" rx="4" fill="#9ef01a"/>`
  );
}

// 브릭 쌓기
function bricks(w, h, p) {
  const colors = [p.main, p.accent, p.sub, p.main, p.accent];
  const bw = 150;
  const bh = 70;
  let out = shadow(w / 2, h * 0.88, 260);
  const rows = [[-2, -1, 0, 1], [-1.5, -0.5, 0.5], [-1, 0], [-0.5]];
  rows.forEach((row, r) => {
    row.forEach((col, i) => {
      const x = w / 2 + col * bw - bw / 2 + bw / 2;
      const y = h * 0.88 - (r + 1) * bh;
      const c = colors[(r + i) % colors.length];
      out += `<rect x="${x - bw / 2}" y="${y}" width="${bw - 6}" height="${bh - 6}" rx="8" fill="${c}"/>`;
      for (let s = 0; s < 3; s++) {
        out += `<rect x="${x - bw / 2 + 18 + s * 44}" y="${y - 16}" width="30" height="18" rx="4" fill="${c}"/>`;
      }
    });
  });
  return out;
}

// 곰 모양 아트토이
function bearToy(w, h, p) {
  const cx = w / 2;
  const base = h * 0.86;
  let dots = '';
  for (let i = 0; i < 18; i++) {
    const x = cx - 110 + ((i * 47) % 220);
    const y = base - 260 + ((i * 31) % 200);
    dots += `<circle cx="${x}" cy="${y}" r="${8 + (i % 3) * 4}" fill="${i % 2 ? p.accent : p.sub}" opacity="0.8"/>`;
  }
  return (
    shadow(cx, base, 170) +
    `<rect x="${cx - 140}" y="${base - 300}" width="280" height="300" rx="120" fill="${p.main}"/>` +
    `<clipPath id="body"><rect x="${cx - 140}" y="${base - 300}" width="280" height="300" rx="120"/></clipPath>` +
    `<g clip-path="url(#body)">${dots}</g>` +
    `<circle cx="${cx - 120}" cy="${base - 520}" r="55" fill="${p.main}"/>` +
    `<circle cx="${cx + 120}" cy="${base - 520}" r="55" fill="${p.main}"/>` +
    `<circle cx="${cx - 120}" cy="${base - 520}" r="28" fill="${p.accent}"/>` +
    `<circle cx="${cx + 120}" cy="${base - 520}" r="28" fill="${p.accent}"/>` +
    `<circle cx="${cx}" cy="${base - 400}" r="150" fill="${p.main}"/>` +
    `<ellipse cx="${cx}" cy="${base - 360}" rx="60" ry="42" fill="${p.skin}"/>` +
    `<circle cx="${cx}" cy="${base - 378}" r="14" fill="${p.sub}"/>` +
    `<circle cx="${cx - 55}" cy="${base - 430}" r="13" fill="${p.sub}"/>` +
    `<circle cx="${cx + 55}" cy="${base - 430}" r="13" fill="${p.sub}"/>`
  );
}

// 작은 디오라마
function diorama(w, h, p) {
  const cx = w / 2;
  const cy = h * 0.68;
  return (
    `<ellipse cx="${cx}" cy="${cy + 40}" rx="330" ry="90" fill="${p.sub}" opacity="0.35"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="320" ry="90" fill="${p.main}"/>` +
    `<path d="M${cx - 320} ${cy} v40 a320 90 0 0 0 640 0 v-40 a320 90 0 0 1 -640 0z" fill="${p.sub}"/>` +
    `<rect x="${cx - 200}" y="${cy - 170}" width="150" height="150" fill="${p.skin}"/>` +
    `<path d="M${cx - 215} ${cy - 170} l90 -80 l90 80z" fill="${p.accent}"/>` +
    `<rect x="${cx - 145}" y="${cy - 80}" width="40" height="60" fill="${p.sub}"/>` +
    `<rect x="${cx - 185}" y="${cy - 140}" width="30" height="30" fill="${p.bg1}"/>` +
    `<rect x="${cx + 120}" y="${cy - 120}" width="20" height="100" fill="${p.sub}"/>` +
    `<circle cx="${cx + 130}" cy="${cy - 150}" r="60" fill="${p.accent}" opacity="0.9"/>` +
    `<circle cx="${cx + 90}" cy="${cy - 120}" r="40" fill="${p.accent}" opacity="0.75"/>` +
    `<circle cx="${cx + 20}" cy="${cy - 30}" r="18" fill="${p.skin}"/>` +
    `<rect x="${cx + 8}" y="${cy - 14}" width="24" height="34" rx="8" fill="${p.sub}"/>`
  );
}

// 대두 비닐 피규어
function chibi(w, h, p) {
  const cx = w / 2;
  const base = h * 0.88;
  return (
    shadow(cx, base, 150) +
    `<rect x="${cx - 80}" y="${base - 170}" width="160" height="170" rx="40" fill="${p.main}"/>` +
    `<rect x="${cx - 70}" y="${base - 40}" width="60" height="40" rx="12" fill="${p.sub}"/>` +
    `<rect x="${cx + 10}" y="${base - 40}" width="60" height="40" rx="12" fill="${p.sub}"/>` +
    `<circle cx="${cx}" cy="${base - 330}" r="190" fill="${p.skin}"/>` +
    `<path d="M${cx - 195} ${base - 330} a195 195 0 0 1 390 0 q-60 -70 -150 -60 q-60 -50 -120 0 q-80 0 -120 60z" fill="${p.sub}"/>` +
    `<ellipse cx="${cx - 70}" cy="${base - 300}" rx="26" ry="34" fill="${p.sub}"/>` +
    `<ellipse cx="${cx + 70}" cy="${base - 300}" rx="26" ry="34" fill="${p.sub}"/>` +
    `<circle cx="${cx - 62}" cy="${base - 312}" r="9" fill="#fff"/>` +
    `<circle cx="${cx + 78}" cy="${base - 312}" r="9" fill="#fff"/>` +
    `<ellipse cx="${cx - 120}" cy="${base - 250}" rx="26" ry="14" fill="${p.main}" opacity="0.35"/>` +
    `<ellipse cx="${cx + 120}" cy="${base - 250}" rx="26" ry="14" fill="${p.main}" opacity="0.35"/>` +
    `<path d="M${cx - 20} ${base - 240} q20 18 40 0" stroke="${p.sub}" stroke-width="7" fill="none" stroke-linecap="round"/>`
  );
}

const SCENES = [figureShelf, mecha, bricks, bearToy, diorama, chibi];

function avatar(i) {
  const p = PALETTES[i % PALETTES.length];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">` +
    `<rect width="200" height="200" fill="${p.bg2}"/>` +
    `<circle cx="100" cy="230" r="95" fill="${p.main}"/>` +
    `<circle cx="100" cy="92" r="50" fill="${p.skin}"/>` +
    `<path d="M48 92 a52 52 0 0 1 104 0 q-${20 + (i % 4) * 8} -30 -52 -26 q-30 -4 -52 26z" fill="${p.sub}"/>` +
    `<circle cx="82" cy="98" r="5" fill="${p.sub}"/><circle cx="118" cy="98" r="5" fill="${p.sub}"/>` +
    `<path d="M88 116 q12 9 24 0" stroke="${p.sub}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
  );
}

function write(rel, content) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

// 피드: 24장(1:1), 장면 6종 × 팔레트 8종 조합
for (let i = 0; i < 24; i++) {
  const p = PALETTES[(i * 3) % PALETTES.length];
  const scene = SCENES[i % SCENES.length];
  write(`feed/feed-${String(i + 1).padStart(2, '0')}.svg`, svg(800, 800, p, scene(800, 800, p)));
}
// 매거진: 10장(3:2)
for (let i = 0; i < 10; i++) {
  const p = PALETTES[(i * 5 + 2) % PALETTES.length];
  const scene = SCENES[(i + 2) % SCENES.length];
  write(`magazine/magazine-${String(i + 1).padStart(2, '0')}.svg`, svg(1200, 800, p, `<g transform="translate(200 0)">${scene(800, 800, p)}</g>`));
}
// 로그인·회원가입 왼쪽 비주얼(세로형). 원본은 public.keeping.link 의 사진을 하드코딩해 쓴다.
{
  const p = PALETTES[3];
  write('auth/login-visual.svg', svg(800, 1250, p, `<g transform="translate(0 -280)">${figureShelf(800, 1250, p)}</g>`));
}
// 프로필: 12장
for (let i = 0; i < 12; i++) {
  write(`avatar/avatar-${String(i + 1).padStart(2, '0')}.svg`, avatar(i));
}
console.log('generated →', OUT);
