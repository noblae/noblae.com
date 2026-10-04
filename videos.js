/* ============================================================
   NOBLAE — videos
   Videos are YouTube links added through the admin page (Videos
   tab), which saves them in videos.json, newest first:
     [{ "id": "dQw4w9WgXcQ", "title": "...", "date": "10.04.26" }]
   This file loads that list and builds each video's block. Used by
   videos.html, index.html (home feed) and admin.html.
   ============================================================ */
(function(){
  "use strict";

  // Pulls the 11-character video id out of any usual YouTube link:
  // youtube.com/watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  window.NOBLAE_youtubeId = function(url){
    url = String(url || '').trim();
    if (/^[\w-]{11}$/.test(url)) return url;
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i);
    return m ? m[1] : null;
  };

  window.NOBLAE_loadVideos = function(){
    return fetch('videos.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(list){ return Array.isArray(list) ? list : []; })
      .catch(function(){ return []; });
  };

  // A video shows its YouTube thumbnail with a play button; clicking it
  // swaps in the real player. (Loading dozens of players at once would
  // make the page slow.)
  window.NOBLAE_videoEl = function(v, opts){
    opts = opts || {};
    var item = document.createElement('article');
    item.className = 'video';

    var frame = document.createElement('div');
    frame.className = 'video-frame';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-play';
    btn.setAttribute('aria-label', 'Play ' + (v.title || 'video'));
    var img = document.createElement('img');
    img.src = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    img.alt = '';
    img.loading = 'lazy';
    var badge = document.createElement('span');
    badge.className = 'play-badge';
    btn.appendChild(img);
    btn.appendChild(badge);
    btn.addEventListener('click', function(){
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0';
      iframe.title = v.title || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(iframe);
    });
    frame.appendChild(btn);

    if (v.title){
      var h3 = document.createElement('h3');
      h3.textContent = v.title;
      item.appendChild(h3);
    }
    item.appendChild(frame);
    if (v.date && !opts.noDate){
      var d = document.createElement('span');
      d.className = 'entry-date';
      d.textContent = v.date;
      item.appendChild(d);
    }
    return item;
  };
})();
