/* ============================================================
   NOBLAE — shared script
   Loaded by every page. Fills in the placeholder photo on any
   <img class="ph"> that doesn't have its own src set yet.
   You should not need to edit this file to add content — see the
   comments at the top of each page's HTML file for that.
   ============================================================ */
(function(){
  "use strict";

  // Shared placeholder photo (shirt image) used anywhere a real
  // photo hasn't been added yet on the Fights and Artwork pages.
  var PLACEHOLDER_IMG = "images/placeholder.jpg";
  window.DINAN_PLACEHOLDER_IMG = PLACEHOLDER_IMG;

  document.addEventListener('DOMContentLoaded', function(){

    // ---------- fill any placeholder images that don't have a real src yet ----------
    Array.prototype.slice.call(document.querySelectorAll('img.ph')).forEach(function(img){
      if (!img.getAttribute('src')){
        img.src = PLACEHOLDER_IMG;
      }
    });

  });
})();
