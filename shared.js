/* ============================================================
   DINAN — shared script
   Loaded by every page. Handles the lights on/off (candlelight)
   effect, the light switch button, and two small conveniences:
     1) filling in the placeholder photo on any <img class="ph">
        that doesn't have its own src set yet
     2) letting poem entries expand/collapse on click
   You should not need to edit this file to add content — see the
   comments at the top of each page's HTML file for that.
   ============================================================ */
(function(){
  "use strict";

  // Shared placeholder photo (shirt image) used anywhere a real
  // photo hasn't been added yet on the Fights and Artwork pages.
  var PLACEHOLDER_IMG = "images/placeholder.jpg";

  // Shared "about" portrait placeholder, used on the About page.
  var ABOUT_IMG = "images/about.jpg";
  window.DINAN_PLACEHOLDER_IMG = PLACEHOLDER_IMG;
  window.DINAN_ABOUT_IMG = ABOUT_IMG;

  document.addEventListener('DOMContentLoaded', function(){

    // ---------- fill any placeholder images that don't have a real src yet ----------
    Array.prototype.slice.call(document.querySelectorAll('img.ph')).forEach(function(img){
      if (!img.getAttribute('src')){
        img.src = PLACEHOLDER_IMG;
      }
    });
    var portraitImg = document.querySelector('#portrait img');
    if (portraitImg && !portraitImg.getAttribute('src')){
      portraitImg.src = ABOUT_IMG;
    }

    // ---------- poems expand/collapse when clicked ----------
    document.addEventListener('click', function(e){
      var poem = e.target.closest ? e.target.closest('.poem') : null;
      if (poem) poem.classList.toggle('open');
    });

    // ---------- candlelight: page goes dark, a flickering glow follows the cursor ----------
    var glowLayer = document.createElement('div');
    glowLayer.id = 'candleGlow';
    document.body.appendChild(glowLayer);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      glowLayer.style.setProperty('--mx', mx + 'px');
      glowLayer.style.setProperty('--my', my + 'px');
    });
    document.addEventListener('mouseleave', function(){
      glowLayer.style.setProperty('--glow-o', '0');
    });
    document.addEventListener('mouseenter', function(){
      glowLayer.style.setProperty('--glow-o', '1');
    });

    function flicker(){
      var r = 95 + Math.random() * 55;
      var warm = 0.28 + Math.random() * 0.22;
      glowLayer.style.setProperty('--glow-r', r + 'px');
      glowLayer.style.setProperty('--glow-warm', warm);
      var next = 60 + Math.random() * 120;
      setTimeout(flicker, next);
    }
    glowLayer.style.setProperty('--mx', mx + 'px');
    glowLayer.style.setProperty('--my', my + 'px');
    flicker();

    // ---------- light switch: toggles the darkness/candlelight effect ----------
    // The on/off state is remembered (localStorage) so it stays the
    // same as you move from page to page.
    var lightSwitch = document.getElementById('lightSwitch');
    var STORAGE_KEY = 'dinan-lights';

    function applyLights(isDark){
      document.body.classList.toggle('dark-mode', isDark);
      if (lightSwitch){
        lightSwitch.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        lightSwitch.textContent = isDark ? 'Lights: Off' : 'Lights: On';
      }
    }

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e){}
    applyLights(saved === 'off');

    if (lightSwitch){
      lightSwitch.addEventListener('click', function(){
        var isDark = !document.body.classList.contains('dark-mode');
        applyLights(isDark);
        try { localStorage.setItem(STORAGE_KEY, isDark ? 'off' : 'on'); } catch(e){}
      });
    }

  });
})();
