import { useId } from "react";
import { categoryById } from "../catalog";

const GLYPHS = {
  phones: (
    <>
      <rect x="68" y="34" width="64" height="132" rx="14" />
      <rect x="76" y="44" width="48" height="104" rx="6" className="fill" />
      <path d="M92 40h16" />
      <circle cx="100" cy="157" r="3" />
    </>
  ),
  computers: (
    <>
      <rect x="44" y="52" width="112" height="72" rx="6" />
      <rect x="52" y="60" width="96" height="56" rx="3" className="fill" />
      <path d="M30 140h140l-10 12H40z" />
      <path d="M88 146h24" />
    </>
  ),
  audio: (
    <>
      <path d="M52 112V96a48 48 0 0 1 96 0v16" />
      <rect x="40" y="108" width="28" height="46" rx="12" className="fill" />
      <rect x="132" y="108" width="28" height="46" rx="12" className="fill" />
      <path d="M78 128c6 4 6 14 0 18M122 128c-6 4-6 14 0 18" />
    </>
  ),
  gaming: (
    <>
      <path d="M62 74h76c20 0 32 18 34 44 2 22-8 34-20 34-10 0-14-12-24-18H72c-10 6-14 18-24 18-12 0-22-12-20-34 2-26 14-44 34-44z" />
      <path d="M64 102v24M52 114h24" />
      <circle cx="132" cy="104" r="5" className="fill" />
      <circle cx="146" cy="118" r="5" className="fill" />
      <circle cx="118" cy="118" r="5" className="fill" />
      <circle cx="132" cy="132" r="5" className="fill" />
    </>
  ),
  accessories: (
    <>
      <path d="M80 62l4-26h32l4 26M80 138l4 26h32l4-26" />
      <rect x="66" y="62" width="68" height="76" rx="18" />
      <rect x="76" y="72" width="48" height="56" rx="10" className="fill" />
      <path d="M100 86v14l9 7" />
      <path d="M134 92h6v16h-6" />
    </>
  ),
  monitor: (
    <>
      <rect x="34" y="46" width="132" height="84" rx="6" />
      <rect x="42" y="54" width="116" height="68" rx="3" className="fill" />
      <path d="M100 130v22M74 156h52" />
    </>
  ),
  tower: (
    <>
      <rect x="70" y="34" width="60" height="132" rx="8" />
      <circle cx="100" cy="64" r="12" className="fill" />
      <path d="M84 98h32M84 110h32M84 122h32" />
      <circle cx="100" cy="150" r="3" />
    </>
  ),
  fold: (
    <>
      <rect x="44" y="44" width="54" height="112" rx="10" />
      <rect x="102" y="44" width="54" height="112" rx="10" />
      <rect x="51" y="52" width="40" height="96" rx="4" className="fill" />
      <rect x="109" y="52" width="40" height="96" rx="4" className="fill" />
    </>
  ),
  buds: (
    <>
      <path d="M70 70a18 18 0 1 1 6 34v40a6 6 0 0 1-12 0v-44a18 18 0 0 1 6-30z" />
      <path d="M130 70a18 18 0 1 0-6 34v40a6 6 0 0 0 12 0v-44a18 18 0 0 0-6-30z" />
      <circle cx="70" cy="88" r="7" className="fill" />
      <circle cx="130" cy="88" r="7" className="fill" />
    </>
  ),
  speaker: (
    <>
      <rect x="60" y="34" width="80" height="132" rx="24" />
      <circle cx="100" cy="122" r="26" className="fill" />
      <circle cx="100" cy="122" r="10" />
      <circle cx="100" cy="66" r="10" />
    </>
  ),
  mouse: (
    <>
      <rect x="70" y="40" width="60" height="120" rx="30" />
      <path d="M100 40v40M70 80h60" />
      <rect x="96" y="54" width="8" height="16" rx="4" className="fill" />
    </>
  ),
  keyboard: (
    <>
      <rect x="24" y="66" width="152" height="68" rx="10" />
      <path d="M40 84h8M58 84h8M76 84h8M94 84h8M112 84h8M130 84h8M148 84h12M40 100h12M62 100h8M80 100h8M98 100h8M116 100h8M134 100h8M152 100h8" />
      <rect x="64" y="112" width="72" height="10" rx="3" className="fill" />
    </>
  ),
  sleeve: (
    <>
      <rect x="36" y="56" width="128" height="92" rx="14" />
      <path d="M36 82h128" />
      <rect x="46" y="92" width="108" height="46" rx="6" className="fill" />
    </>
  ),
  case: (
    <>
      <rect x="64" y="30" width="72" height="140" rx="18" />
      <rect x="74" y="40" width="52" height="120" rx="12" className="fill" />
      <rect x="80" y="48" width="18" height="30" rx="8" />
    </>
  ),
  cable: (
    <>
      <path d="M50 150c0-40 30-40 30-70s-20-34-20-44" />
      <path d="M150 50c0 40-30 40-30 70s20 34 20 44" />
      <rect x="52" y="22" width="16" height="22" rx="4" className="fill" />
      <rect x="132" y="156" width="16" height="22" rx="4" className="fill" />
    </>
  ),
  charger: (
    <>
      <rect x="58" y="62" width="84" height="96" rx="16" />
      <path d="M84 62V40M116 62V40" />
      <path d="M104 88l-14 22h20l-14 22" className="fill" />
    </>
  ),
};

const KEYWORDS = [
  [/monitor|display/i, "monitor"],
  [/tower|desktop/i, "tower"],
  [/fold/i, "fold"],
  [/buds/i, "buds"],
  [/speaker/i, "speaker"],
  [/headset|headphone/i, "audio"],
  [/mouse/i, "mouse"],
  [/keyboard/i, "keyboard"],
  [/pad|controller/i, "gaming"],
  [/sleeve/i, "sleeve"],
  [/case/i, "case"],
  [/cable/i, "cable"],
  [/charge|brick|adapter/i, "charger"],
];

const pickGlyph = ({ name = "", category }) =>
  GLYPHS[KEYWORDS.find(([pattern]) => pattern.test(name))?.[1]] ||
  GLYPHS[category] ||
  GLYPHS.phones;

const WIDTHS = [320, 640, 960, 1280];

// Unsplash and Cloudinary both resize on the fly; anything else is used as is.
export function sized(url, width) {
  if (url.includes("images.unsplash.com")) {
    const next = new URL(url);
    next.searchParams.set("w", width);
    return next.toString();
  }
  if (url.includes("res.cloudinary.com/") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/c_limit,w_${width},f_auto,q_auto/`);
  }
  return null;
}

function Photo({ url, sizes, eager }) {
  const resizable = sized(url, WIDTHS[0]) !== null;
  return (
    <img
      src={resizable ? sized(url, 960) : url}
      srcSet={resizable ? WIDTHS.map((w) => `${sized(url, w)} ${w}w`).join(", ") : undefined}
      sizes={sizes}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

// A product photo when there is one; otherwise generated art for its category.
export default function ProductArt({
  product,
  className = "",
  sizes = "(max-width: 760px) 100vw, 400px",
  eager = false,
}) {
  const id = useId().replace(/:/g, "");
  const { color } = categoryById(product.category);
  const seed = String(product.id || product.name)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tilt = (seed % 24) - 12;

  if (product.image?.url) {
    return (
      <div className={`product-art photo ${className}`} style={{ "--accent": color }}>
        <Photo url={product.image.url} sizes={sizes} eager={eager} />
      </div>
    );
  }

  return (
    <div className={`product-art ${className}`} style={{ "--accent": color }}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id={`orb-${id}`} cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor={color} stopOpacity="0.55" />
            <stop offset="0.6" stopColor={color} stopOpacity="0.08" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <pattern id={`grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#grid-${id})`} />
        <circle cx="100" cy="96" r="92" fill={`url(#orb-${id})`} />
        <ellipse cx="100" cy="176" rx="56" ry="6" fill={color} opacity="0.18" />
        <g
          className="glyph"
          transform={`rotate(${tilt} 100 100)`}
          stroke={`url(#line-${id})`}
          style={{ "--fill": color }}
        >
          {pickGlyph(product)}
        </g>
      </svg>
    </div>
  );
}
