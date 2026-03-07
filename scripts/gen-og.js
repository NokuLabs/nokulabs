'use strict'
// ─── OG image generator ───────────────────────────────────────────────────────
// Output: public/og/nokulabs-og.jpg  (1200 × 630, JPEG q95)
// Run once:  node scripts/gen-og.js
// Requires:  @napi-rs/canvas  (installed as a dev dep — no bundling)
// ─────────────────────────────────────────────────────────────────────────────

const { createCanvas, GlobalFonts } = require('@napi-rs/canvas')
const fs   = require('fs')
const path = require('path')

// ── Fonts (Windows Consolas — shipped with every Windows install) ─────────────
GlobalFonts.registerFromPath('C:\\Windows\\Fonts\\consola.ttf',  'NK')
GlobalFonts.registerFromPath('C:\\Windows\\Fonts\\consolab.ttf', 'NK-Bold')

// ── Canvas ────────────────────────────────────────────────────────────────────
const W = 1200
const H = 630
const canvas = createCanvas(W, H)
const ctx    = canvas.getContext('2d')

// ── Helpers ───────────────────────────────────────────────────────────────────
function poly(pts, fill, stroke, lw = 1.5) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
  if (fill)   { ctx.fillStyle = fill;     ctx.fill() }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke() }
}

function line(x1, y1, x2, y2, color, lw = 1) {
  ctx.strokeStyle = color; ctx.lineWidth = lw
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
}

function dot(x, y, r, color) {
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
}

// ── Background ────────────────────────────────────────────────────────────────
ctx.fillStyle = '#0A0A0A'
ctx.fillRect(0, 0, W, H)

// ── Technical grid ────────────────────────────────────────────────────────────
ctx.strokeStyle = 'rgba(255,255,255,0.028)'
ctx.lineWidth   = 1
const GRID = 40
for (let x = 0; x <= W; x += GRID) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
}
for (let y = 0; y <= H; y += GRID) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
}

// ── Isometric cube ────────────────────────────────────────────────────────────
const CX = 890   // cube centre x
const CY = 318   // cube centre y
const S  = 158   // side half-height

const hw = S * Math.sqrt(3) / 2   // half-width in screen space  ≈ 136.8
const hs = S * 0.5                 // half-height of each rhombus ≈  79

const vtTop         = [CX,      CY - S ]   // apex
const vtBottom      = [CX,      CY + S ]   // nadir
const vtTopLeft     = [CX - hw, CY - hs]   // left shoulder
const vtTopRight    = [CX + hw, CY - hs]   // right shoulder
const vtBottomLeft  = [CX - hw, CY + hs]   // left foot
const vtBottomRight = [CX + hw, CY + hs]   // right foot
const vtCenter      = [CX,      CY     ]   // centroid (hidden vertex)

// Ambient radial glow
const glowGrad = ctx.createRadialGradient(CX, CY - 30, 0, CX, CY, S * 2.1)
glowGrad.addColorStop(0,    'rgba(255,255,255,0.11)')
glowGrad.addColorStop(0.35, 'rgba(255,255,255,0.045)')
glowGrad.addColorStop(1,    'rgba(255,255,255,0)')
ctx.fillStyle = glowGrad
ctx.fillRect(CX - S * 2.2, CY - S * 2.2, S * 4.4, S * 4.4)

// Top face  — brightest (light source above)
poly(
  [vtTop, vtTopRight, vtCenter, vtTopLeft],
  'rgba(255,255,255,0.095)',
  'rgba(255,255,255,0.72)',
  1.6
)

// Right face — mid
poly(
  [vtTopRight, vtBottomRight, vtBottom, vtCenter],
  'rgba(255,255,255,0.040)',
  'rgba(255,255,255,0.52)',
  1.4
)

// Left face  — darkest
poly(
  [vtTopLeft, vtCenter, vtBottom, vtBottomLeft],
  'rgba(255,255,255,0.065)',
  'rgba(255,255,255,0.38)',
  1.4
)

// Interior dashed edges (hidden lines — technical drafting aesthetic)
ctx.setLineDash([3, 7])
ctx.strokeStyle = 'rgba(255,255,255,0.18)'
ctx.lineWidth   = 1
// Centre → bottom  (vertical hidden edge)
ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX, CY + S); ctx.stroke()
// Centre → topRight  hidden diagonal
ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + hw, CY - hs); ctx.stroke()
// Centre → topLeft   hidden diagonal
ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX - hw, CY - hs); ctx.stroke()
ctx.setLineDash([])

// Bright top-edge highlight
ctx.strokeStyle = 'rgba(255,255,255,0.92)'
ctx.lineWidth   = 2.2
ctx.beginPath(); ctx.moveTo(vtTop[0], vtTop[1]); ctx.lineTo(vtTopRight[0], vtTopRight[1]); ctx.stroke()
ctx.beginPath(); ctx.moveTo(vtTop[0], vtTop[1]); ctx.lineTo(vtTopLeft[0],  vtTopLeft[1]);  ctx.stroke()

// Vertex dots (precise, technical)
const allVerts = [vtTop, vtTopRight, vtTopLeft, vtBottom, vtBottomRight, vtBottomLeft]
allVerts.forEach(([x, y]) => dot(x, y, 2.2, 'rgba(255,255,255,0.65)'))
dot(CX, CY, 1.8, 'rgba(255,255,255,0.35)')  // hidden centre dot (dimmer)

// ── Vertical divider ──────────────────────────────────────────────────────────
line(630, 72, 630, H - 72, 'rgba(255,255,255,0.07)', 1)

// ── Text — left zone ──────────────────────────────────────────────────────────
const TX = 80   // text left margin

// Eyebrow — tiny mono label
ctx.fillStyle = 'rgba(255,255,255,0.28)'
ctx.font      = '13px "NK"'
ctx.fillText('01 ──── SOFTWARE STUDIO', TX, 202)

// Short rule above headline
line(TX, 224, TX + 44, 224, 'rgba(255,255,255,0.20)', 1)

// Headline — "NOKU LABS"
ctx.fillStyle = 'rgba(255,255,255,0.97)'
ctx.font      = '74px "NK-Bold"'
ctx.fillText('NOKU LABS', TX, 306)

// Thin rule below headline
line(TX, 330, TX + 430, 330, 'rgba(255,255,255,0.14)', 1)

// Tagline
ctx.fillStyle = 'rgba(255,255,255,0.50)'
ctx.font      = '21px "NK"'
ctx.fillText('Software construit pentru', TX, 375)
ctx.fillText('medii care nu pot e\u015fua.', TX, 404)

// Domain footnote
ctx.fillStyle = 'rgba(255,255,255,0.18)'
ctx.font      = '13px "NK"'
ctx.fillText('nokulabs.com', TX, 498)

// ── Corner frame marks ────────────────────────────────────────────────────────
const M = 38   // inset from edge
const A = 20   // arm length
const FC = 'rgba(255,255,255,0.20)'
const FW = 1.5

// top-left
line(M,     M + A, M,     M,     FC, FW)
line(M,     M,     M + A, M,     FC, FW)
// top-right
line(W-M-A, M,     W-M,   M,     FC, FW)
line(W-M,   M,     W-M,   M + A, FC, FW)
// bottom-left
line(M,     H-M-A, M,     H-M,   FC, FW)
line(M,     H-M,   M + A, H-M,   FC, FW)
// bottom-right
line(W-M-A, H-M,   W-M,   H-M,   FC, FW)
line(W-M,   H-M-A, W-M,   H-M,   FC, FW)

// ── Vignette (darken edges) ───────────────────────────────────────────────────
const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.88)
vig.addColorStop(0, 'rgba(0,0,0,0)')
vig.addColorStop(1, 'rgba(0,0,0,0.52)')
ctx.fillStyle = vig
ctx.fillRect(0, 0, W, H)

// ── Write JPEG ────────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, '..', 'public', 'og', 'nokulabs-og.jpg')
const buf     = canvas.toBuffer('image/jpeg', { quality: 0.95 })
fs.writeFileSync(outPath, buf)
console.log(`✓  ${outPath}`)
console.log(`   ${W}×${H}px · ${(buf.length / 1024).toFixed(0)} KB`)
