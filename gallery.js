/* ============================================================
   NOBLAE — image gallery list
   Images show up on the Images page in two ways:
     1) uploaded through the private admin page (admin.html), which
        records them, with captions, in images.json
     2) dropped straight into the images/gallery folder on GitHub
   This file combines both into one list. Used by images.html and admin.html.
   ============================================================ */
(function(){
  "use strict";

  var IMAGE_RE = /\.(jpe?g|png|gif|webp|avif)$/i;

  // manifest: entries from images.json, newest first
  // folder:   GitHub's listing of images/gallery (may be empty)
  // Returns the manifest entries, then any other images in the folder
  // in alphabetical order, marked with manual: true.
  window.NOBLAE_mergeImages = function(manifest, folder){
    var known = {};
    manifest.forEach(function(e){ known[e.src] = true; });
    var extra = (folder || []).filter(function(f){
      return f.type === 'file' && IMAGE_RE.test(f.name) && !known[f.path];
    }).sort(function(a, b){
      return a.name.localeCompare(b.name);
    }).map(function(f){
      return { src: f.path, caption: '', manual: true };
    });
    return manifest.concat(extra);
  };
})();
