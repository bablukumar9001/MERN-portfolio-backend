const Image = require("../model/image");

// If `ref` points at an uploaded image (/api/images/<id>), delete that doc.
// No-op for external URLs or static paths.
const deleteImageByRef = async (ref) => {
  const m = /\/api\/images\/([a-f0-9]{24})/i.exec(ref || "");
  if (!m) return;
  try {
    await Image.findByIdAndDelete(m[1]);
  } catch (_) {
    /* ignore — image already gone */
  }
};

// On update: if the image field changed, drop the old uploaded image.
const cleanupReplacedImage = async (oldRef, newRef) => {
  if (oldRef && oldRef !== newRef) await deleteImageByRef(oldRef);
};

module.exports = { deleteImageByRef, cleanupReplacedImage };
