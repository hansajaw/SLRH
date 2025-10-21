import { connect, done } from "./utils.js";
import { Video, Album, MediaImage, News } from "../src/models/media.js";

function arg(name, def = "") {
  const i = process.argv.findIndex(a => a === `--${name}`);
  return i >= 0 ? (process.argv[i + 1] ?? def) : def;
}

const kind = process.argv[2]; // video|album|image|news

(async () => {
  try {
    await connect();

    if (kind === "video") {
      const doc = await Video.create({
        title: arg("title"),
        caption: arg("caption"),
        youtubeId: arg("youtubeId"),
        thumbnail: arg("thumbnail"),
      });
      console.log("✅ Video:", doc._id);
    } else if (kind === "album") {
      const doc = await Album.create({ title: arg("title"), cover: arg("cover") });
      console.log("✅ Album:", doc._id);
    } else if (kind === "image") {
      const albumTitle = arg("albumTitle");
      const album = await Album.findOne({ title: albumTitle });
      if (!album) throw new Error(`Album not found: ${albumTitle}`);
      const doc = await MediaImage.create({ album: album._id, src: arg("src"), caption: arg("caption") });
      console.log("✅ Image:", doc._id);
    } else if (kind === "news") {
      const doc = await News.create({
        title: arg("title"),
        excerpt: arg("excerpt"),
        body: arg("body"),
        banner: arg("banner"),
        publishedAt: arg("publishedAt") || new Date(),
      });
      console.log("✅ News:", doc._id);
    } else {
      console.log("Usage:");
      console.log("  node scripts/add-media.js video --title \"t\" --youtubeId abc --thumbnail url --caption \"c\"");
      console.log("  node scripts/add-media.js album --title \"t\" --cover url");
      console.log("  node scripts/add-media.js image --albumTitle \"t\" --src url --caption \"c\"");
      console.log("  node scripts/add-media.js news --title \"t\" --excerpt \"e\" --body \"...\" --banner url");
    }

    await done(0);
  } catch (e) {
    console.error("❌", e.message);
    await done(1);
  }
})();
