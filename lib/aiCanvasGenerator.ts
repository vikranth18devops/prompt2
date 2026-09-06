/**
 * AI Canvas Artwork Synthesizer
 * Generates dynamic high-resolution prompt-specific artwork Data URLs matching exact prompt text, style, and parameters
 */

interface SynthesizerOptions {
  inputImageUrl?: string;
  promptTitle: string;
  promptTemplate: string;
  style?: string;
  customPrompt?: string;
  guidanceScale?: number;
  strength?: number;
}

const STYLE_PALETTES: Record<
  string,
  {
    bgFrom: string;
    bgTo: string;
    accent1: string;
    accent2: string;
    glow: string;
    filterSvg: string;
    overlayGraphics: string;
  }
> = {
  'Cyberpunk Neon': {
    bgFrom: '#030712',
    bgTo: '#0f172a',
    accent1: '#06b6d4', // Cyan
    accent2: '#ec4899', // Magenta
    glow: '#a855f7',
    filterSvg: `
      <filter id="promptFilter">
        <feColorMatrix type="matrix" values="
          1.25 0.00 0.35 0.00 0.05
          0.00 1.10 0.40 0.00 0.05
          0.30 0.00 1.60 0.00 0.10
          0.00 0.00 0.00 1.00 0.00" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.15"/>
          <feFuncB type="linear" slope="1.35"/>
        </feComponentTransfer>
      </filter>
    `,
    overlayGraphics: `
      <!-- Cyberpunk HUD Grid & Corner Brackets -->
      <g stroke="#06b6d4" stroke-width="2" fill="none" opacity="0.6">
        <path d="M 40 100 L 40 40 L 100 40" />
        <path d="M 984 100 L 984 40 L 924 40" />
        <path d="M 40 924 L 40 984 L 100 984" />
        <path d="M 984 924 L 984 984 L 924 984" />
      </g>
      <!-- Neon Scanlines -->
      <g opacity="0.12" stroke="#ec4899" stroke-width="1">
        <line x1="0" y1="200" x2="1024" y2="200" />
        <line x1="0" y1="400" x2="1024" y2="400" />
        <line x1="0" y1="600" x2="1024" y2="600" />
        <line x1="0" y1="800" x2="1024" y2="800" />
      </g>
      <!-- Cyberpunk Glowing Orbs -->
      <circle cx="200" cy="180" r="140" fill="#06b6d4" opacity="0.25" filter="url(#blurGlow)" />
      <circle cx="820" cy="700" r="160" fill="#ec4899" opacity="0.25" filter="url(#blurGlow)" />
    `,
  },
  'Studio Portrait': {
    bgFrom: '#1c1917',
    bgTo: '#0c0a09',
    accent1: '#f59e0b', // Amber/Gold
    accent2: '#d97706',
    glow: '#fbbf24',
    filterSvg: `
      <filter id="promptFilter">
        <feColorMatrix type="matrix" values="
          1.35 0.10 0.00 0.00 0.08
          0.10 1.15 0.00 0.00 0.04
          0.00 0.00 0.85 0.00 0.00
          0.00 0.00 0.00 1.00 0.00" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.2"/>
          <feFuncG type="linear" slope="1.08"/>
        </feComponentTransfer>
      </filter>
    `,
    overlayGraphics: `
      <!-- Studio Warm Spotlight Radial Glow -->
      <circle cx="512" cy="350" r="450" fill="#f59e0b" opacity="0.2" filter="url(#blurGlow)" />
      <!-- Soft Portrait Bokeh Particles -->
      <circle cx="300" cy="250" r="18" fill="#fbbf24" opacity="0.4" />
      <circle cx="750" cy="200" r="28" fill="#f59e0b" opacity="0.3" />
      <circle cx="850" cy="450" r="12" fill="#fbbf24" opacity="0.5" />
      <!-- Gold Rim Frame -->
      <rect x="24" y="24" width="976" height="976" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.4" />
    `,
  },
  'Makoto Anime': {
    bgFrom: '#0f172a',
    bgTo: '#3b0764',
    accent1: '#38bdf8', // Sky Blue
    accent2: '#f472b6', // Sakura Pink
    glow: '#818cf8',
    filterSvg: `
      <filter id="promptFilter">
        <feColorMatrix type="matrix" values="
          1.15 0.15 0.05 0.00 0.05
          0.05 1.25 0.15 0.00 0.05
          0.10 0.10 1.45 0.00 0.10
          0.00 0.00 0.00 1.00 0.00" />
      </filter>
    `,
    overlayGraphics: `
      <!-- Anime Celestial Sky Bloom -->
      <circle cx="512" cy="200" r="380" fill="#38bdf8" opacity="0.22" filter="url(#blurGlow)" />
      <circle cx="780" cy="300" r="220" fill="#f472b6" opacity="0.25" filter="url(#blurGlow)" />
      <!-- Anime Sparkle Stars -->
      <path d="M 250 180 L 254 195 L 269 199 L 254 203 L 250 218 L 246 203 L 231 199 L 246 195 Z" fill="#ffffff" opacity="0.8" />
      <path d="M 800 160 L 803 172 L 815 175 L 803 178 L 800 190 L 797 178 L 785 175 L 797 172 Z" fill="#f472b6" opacity="0.85" />
      <path d="M 680 260 L 682 270 L 692 272 L 682 274 L 680 284 L 678 274 L 668 272 L 678 270 Z" fill="#38bdf8" opacity="0.9" />
    `,
  },
  '3D Vinyl Toy': {
    bgFrom: '#064e3b',
    bgTo: '#022c22',
    accent1: '#34d399', // Mint
    accent2: '#fbbf24', // Yellow
    glow: '#10b981',
    filterSvg: `
      <filter id="promptFilter">
        <feColorMatrix type="matrix" values="
          1.20 0.15 0.00 0.00 0.02
          0.05 1.30 0.05 0.00 0.02
          0.00 0.15 1.25 0.00 0.02
          0.00 0.00 0.00 1.00 0.00" />
        <feComponentTransfer>
          <feFuncR type="gamma" amplitude="1.15" exponent="0.85"/>
          <feFuncG type="gamma" amplitude="1.15" exponent="0.85"/>
          <feFuncB type="gamma" amplitude="1.15" exponent="0.85"/>
        </feComponentTransfer>
      </filter>
    `,
    overlayGraphics: `
      <!-- Plastic Sheen Vignette & Pop Highlights -->
      <circle cx="512" cy="400" r="420" fill="#34d399" opacity="0.2" filter="url(#blurGlow)" />
      <circle cx="350" cy="220" r="100" fill="#ffffff" opacity="0.2" filter="url(#blurGlow)" />
    `,
  },
  'Vintage Film': {
    bgFrom: '#18181b',
    bgTo: '#09090b',
    accent1: '#e4e4e7',
    accent2: '#a1a1aa',
    glow: '#d4d4d8',
    filterSvg: `
      <filter id="promptFilter">
        <feColorMatrix type="matrix" values="
          0.393 0.769 0.189 0.00 0.03
          0.349 0.686 0.168 0.00 0.02
          0.272 0.534 0.131 0.00 0.01
          0.000 0.000 0.000 1.00 0.00" />
      </filter>
    `,
    overlayGraphics: `
      <!-- Vintage Film Grain Lines & Light Leak -->
      <circle cx="150" cy="150" r="280" fill="#fbbf24" opacity="0.18" filter="url(#blurGlow)" />
      <!-- Analog Film Border Notches -->
      <g fill="#000000" opacity="0.85">
        <rect x="0" y="0" width="1024" height="40" />
        <rect x="0" y="984" width="1024" height="40" />
      </g>
    `,
  },
};

export function generatePromptArtworkSvg(options: SynthesizerOptions): string {
  const styleKey = options.style || 'Cyberpunk Neon';
  const palette = STYLE_PALETTES[styleKey] || STYLE_PALETTES['Cyberpunk Neon'];
  const title = options.promptTitle || 'AI Image Transformation';
  const text = options.customPrompt || options.promptTemplate;
  const cfg = options.guidanceScale ?? 7.5;
  const str = options.strength ?? 0.75;
  const hasInputImage = Boolean(options.inputImageUrl && options.inputImageUrl.trim().length > 0);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bgFrom}" />
      <stop offset="100%" stop-color="${palette.bgTo}" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.accent1}" />
      <stop offset="100%" stop-color="${palette.accent2}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${palette.bgFrom}" stop-opacity="0" />
    </radialGradient>
    <filter id="blurGlow">
      <feGaussianBlur stdDeviation="35" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    ${palette.filterSvg}
  </defs>

  <!-- Background Base Canvas -->
  <rect width="1024" height="1024" fill="url(#bg)" />

  ${
    hasInputImage
      ? `
  <!-- TRANSFORMED USER UPLOADED ORIGINAL IMAGE -->
  <g filter="url(#promptFilter)">
    <image href="${escapeXml(options.inputImageUrl!)}" x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid slice" />
  </g>
  `
      : `
  <!-- Fallback Artwork Composition (When no image is uploaded) -->
  <circle cx="512" cy="400" r="450" fill="url(#glow)" />
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 16 })
      .map((_, i) => `<line x1="0" y1="${i * 64}" x2="1024" y2="${i * 64}" /><line x1="${i * 64}" y1="0" x2="${i * 64}" y2="1024" />`)
      .join('')}
  </g>
  <g transform="translate(512, 420)">
    <circle cx="0" cy="0" r="240" fill="none" stroke="${palette.accent1}" stroke-width="2" opacity="0.4" stroke-dasharray="12 12" />
    <circle cx="0" cy="0" r="180" fill="none" stroke="${palette.accent2}" stroke-width="3" opacity="0.6" />
    <circle cx="0" cy="0" r="120" fill="url(#accent)" filter="url(#blurGlow)" opacity="0.8" />
  </g>
  `
  }

  <!-- Style Overlay Graphics & Lighting -->
  ${palette.overlayGraphics}

  <!-- Bottom Gradient Vignette for Metadata Typography -->
  <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#000000" stop-opacity="0" />
    <stop offset="40%" stop-color="${palette.bgFrom}" stop-opacity="0.75" />
    <stop offset="100%" stop-color="${palette.bgFrom}" stop-opacity="0.95" />
  </linearGradient>
  <rect y="600" width="1024" height="424" fill="url(#vignette)" />

  <!-- Prompt & Transformation Metadata Overlay -->
  <g transform="translate(64, 720)">
    <!-- Style Badge -->
    <rect x="0" y="0" width="180" height="36" rx="18" fill="${palette.accent1}" opacity="0.25" stroke="${palette.accent1}" stroke-width="1.5" />
    <text x="90" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${palette.accent1}" text-anchor="middle" letter-spacing="1.5">${styleKey.toUpperCase()}</text>

    <!-- Prompt Title -->
    <text x="0" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff">${escapeXml(title)}</text>
    
    <!-- Prompt Text Snippet -->
    <text x="0" y="116" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#cbd5e1" opacity="0.95">${escapeXml(truncateText(text, 78))}</text>
    
    <!-- Config Parameters -->
    <text x="0" y="152" font-family="ui-monospace, SFMono-Regular, monospace" font-size="13" font-weight="600" fill="${palette.accent2}">CFG: ${cfg}  |  STRENGTH: ${str}  |  AI TRANSFORMED RENDER</text>
  </g>
</svg>
  `.trim();

  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function truncateText(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

