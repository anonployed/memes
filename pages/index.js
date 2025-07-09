import { useState } from "react";
import path from "path";

function formatName(filename) {
  const name = filename.replace(/\.[^/.]+$/, "");
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function getType(filename) {
  return filename.toLowerCase().endsWith(".gif") ? "animated" : "static";
}

export async function getStaticProps() {
  const fs = require("fs");
  const memesDir = path.join(process.cwd(), "public/memes");
  const files = fs.readdirSync(memesDir).sort((a, b) => {
    return fs.statSync(path.join(memesDir, b)).ctimeMs - fs.statSync(path.join(memesDir, a)).ctimeMs;
  });
  return { props: { images: files } };
}

export default function MemesGrid({ images }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredImages = images.filter((img) => {
    if (filter === "all") return true;
    return getType(img) === filter;
  });

  const handleCopy = async (img, idx) => {
    await navigator.clipboard.writeText(`${window.location.origin}/memes/${img}`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 950);
  };

  return (
    <main className="main-memes">
      <h1 className="heading-memes">DeFiLlama Memes</h1>
      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "static" ? "active" : ""} onClick={() => setFilter("static")}>Static</button>
        <button className={filter === "animated" ? "active" : ""} onClick={() => setFilter("animated")}>Animated</button>
      </div>
      <div className="grid-memes">
        {filteredImages.map((img, idx) => (
          <div
            key={img}
            className={`card-memes${idx === 0 && filter === "all" ? " highlight-meme" : ""}`}
            title={formatName(img)}
          >
            <div className="img-memes-wrapper">
              <img src={`/memes/${img}`} alt={img} className="img-memes" />
            </div>
            <div className="meme-row">
              <span className="meme-name">{formatName(img)}</span>
              <button
                className={`btn-memes${copiedIndex === idx ? " copied" : ""}`}
                onClick={() => handleCopy(img, idx)}
                aria-label="Copy URL"
              >
                <span role="img" aria-label="Copy" style={{ fontSize: "1.18em" }}>📋</span>
                <span className="tooltip">{copiedIndex === idx ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
