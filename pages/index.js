import { useState } from "react";
import { getMemes } from "../utils/memeHelpers";

export async function getStaticProps() {
  const images = getMemes();
  return { props: { images } };
}

function isGif(filename) {
  return filename.toLowerCase().endsWith(".gif");
}

export default function MemesGrid({ images }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredImages = images.filter(img => {
    if (filter === "all") return true;
    return img.type === filter;
  });

 const handleCopy = async (img, idx) => {
  const imageUrl = `/memes/${img.filename}`;
  
  const fallbackCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${imageUrl}`);
  };

  try {
    if ("ClipboardItem" in window && !navigator.userAgent.includes("Safari")) {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
    } else {
      await fallbackCopy();
    }
  } catch {
    await fallbackCopy();
  }

  setCopiedIndex(idx);
  setTimeout(() => setCopiedIndex(null), 900);
};


  return (
    <main className="main-memes">
      <h1 className="heading-memes">DeFiLlama Memes</h1>
      <div className="filter-buttons">
        {["all", "static", "animated"].map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid-memes">
        {filteredImages.map((img, idx) => (
          <div
            key={img.filename}
            className={`card-memes${idx === 0 && filter === "all" ? " highlight-meme" : ""}`}
            title={img.name}
          >
            <div className="img-memes-wrapper">
              <img src={`/memes/${img.filename}`} alt={img.name} className="img-memes" />
            </div>
            <div className="meme-row">
              <span className="meme-name">{img.name}</span>
              <button
                className={`btn-memes${copiedIndex === idx ? " copied" : ""}`}
                onClick={() => handleCopy(img, idx)}
                aria-label="Copy"
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
