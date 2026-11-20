// Photo albums for /misc/photos.
//
// Every folder under misc/photos/ is an album and every image in it is
// a photo. Albums are ordered by their most recent photo, newest
// album first, and photos within an album are newest first. Times come
// from EXIF DateTimeOriginal. Each photo
// is resized/re-encoded by @11ty/eleventy-img into _site/img/photos/.
//
// An album folder may contain an optional `album.json`:
//   {
//     "title": "Turkey Run",                     // default: from folder name
//     "description": "A short blurb (Markdown not supported)",
//     "captions": { "IMG_1449.JPEG": "Alt text / caption for this photo" }
//   }

const fs = require("node:fs");
const path = require("node:path");
const exifr = require("exifr");

const PHOTOS_DIR = "misc/photos";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".tif", ".tiff"]);

// Thumbnails in the gallery, plus a large version for the click-through.
const WIDTHS = [480, 960, 2048];
const FULL_WIDTH = 2048;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// EXIF stores local wall-clock time as "YYYY:MM:DD HH:MM:SS"; keep it as
// plain components so neither sorting nor display depends on the build
// machine's time zone.
async function captureTime(file) {
  try {
    const exif = await exifr.parse(file, { pick: ["DateTimeOriginal", "CreateDate"], reviveValues: false });
    const raw = exif?.DateTimeOriginal ?? exif?.CreateDate;
    const m = raw?.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (m) {
      return { key: m.slice(1).join(""), year: +m[1], month: +m[2], day: +m[3] };
    }
  } catch {}
  // No EXIF date: fall back to the file's modification time.
  const d = fs.statSync(file).mtime;
  const pad = n => String(n).padStart(2, "0");
  return {
    key: `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`,
    year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
  };
}

const formatDay = t => `${MONTHS[t.month - 1]} ${t.day}, ${t.year}`;

// "October 26, 2026", "October 13–24, 2026",
// "October 31 – November 7, 2026", or "December 30, 2025 – January 2, 2026"
function formatRange(a, b) {
  if (a.year !== b.year) return `${formatDay(a)} – ${formatDay(b)}`;
  if (a.month !== b.month) return `${MONTHS[a.month - 1]} ${a.day} – ${MONTHS[b.month - 1]} ${b.day}, ${a.year}`;
  if (a.day !== b.day) return `${MONTHS[a.month - 1]} ${a.day}–${b.day}, ${a.year}`;
  return formatDay(a);
}

// "dark-sky-park" -> "Dark Sky Park"; a trailing two-digit year
// ("monticello26") is dropped since the album already shows its date.
function titleFromFolder(name) {
  return name
    .replace(/[-_]?\d{2}$/, "")
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function readAlbumConfig(dir) {
  const file = path.join(dir, "album.json");
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

module.exports = async function () {
  const { default: Image, generateHTML } = await import("@11ty/eleventy-img");

  const folders = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  const albums = await Promise.all(folders.map(async folder => {
    const dir = path.join(PHOTOS_DIR, folder);
    const config = readAlbumConfig(dir);
    const title = config.title ?? titleFromFolder(folder);
    const captions = config.captions ?? {};

    const files = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));

    const photos = await Promise.all(files.map(async file => {
      const src = path.join(dir, file);
      const [time, metadata] = await Promise.all([
        captureTime(src),
        Image(src, {
          widths: WIDTHS,
          formats: ["webp", "jpeg"],
          outputDir: `_site/img/photos/${folder}/`,
          urlPath: `/img/photos/${folder}/`,
        }),
      ]);

      const caption = captions[file] ?? "";
      const jpegs = metadata.jpeg;
      const full = jpegs.find(j => j.width >= FULL_WIDTH) ?? jpegs[jpegs.length - 1];
      const small = jpegs[0];

      return {
        file,
        caption,
        time,
        date: formatDay(time),
        fullUrl: full.url,
        aspectRatio: small.width / small.height,
        html: generateHTML(metadata, {
          alt: caption || `Photo from ${title}, ${formatDay(time)}`,
          sizes: "(min-width: 768px) 20rem, 50vw",
          loading: "lazy",
          decoding: "async",
        }),
      };
    }));

    photos.sort((a, b) => b.time.key.localeCompare(a.time.key));

    return {
      slug: folder,
      title,
      description: config.description ?? "",
      latest: photos[0]?.time,
      dates: photos.length ? formatRange(photos[photos.length - 1].time, photos[0].time) : "",
      photos,
    };
  }));

  return albums
    .filter(a => a.photos.length)
    .sort((a, b) => b.latest.key.localeCompare(a.latest.key));
};
