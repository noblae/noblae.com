/* ============================================================
   NOBLAE — pages for long lists
   Splits a list (poems, essays, images, the home feed) into pages
   and adds a "per page" box (10 / 25 / 100) above it and page
   numbers below it. It only changes what's shown in the browser;
   the HTML files themselves stay exactly as they are, so adding
   entries (by hand or through admin.html) works the same as before.

   Lists opt in with a data-paginate attribute naming their items:
     <div id="poemList" data-paginate=".poem" data-sort="date">
   data-sort="date" shows entries newest first (by their MM.DD.YY).
   Pages that build their list with JavaScript call
     NOBLAE_paginate(listElement, itemSelector)
   once the items are in place.
   ============================================================ */
(function(){
  "use strict";

  var OPTIONS = [10, 25, 100];
  var DEFAULT = 10;
  var STORE_KEY = 'noblae-per-page';
  var DATE_RE = /(\d{2})\.(\d{2})\.(\d{2})/;

  function getPerPage(){
    var n = DEFAULT;
    try { n = parseInt(localStorage.getItem(STORE_KEY), 10) || DEFAULT; } catch(e){}
    return OPTIONS.indexOf(n) === -1 ? DEFAULT : n;
  }
  function savePerPage(n){
    try { localStorage.setItem(STORE_KEY, String(n)); } catch(e){}
  }
  function getPageParam(){
    var m = location.search.match(/[?&]page=(\d+)/);
    return m ? Math.max(1, parseInt(m[1], 10)) : 1;
  }
  function setPageParam(page){
    if (!window.history || !history.replaceState) return;
    var url = location.pathname + (page > 1 ? '?page=' + page : '') + location.hash;
    try { history.replaceState(null, '', url); } catch(e){}
  }

  function dateOf(el){
    var d = el.querySelector('.poem-date, .entry-date');
    var m = d && d.textContent.match(DATE_RE);
    return m ? new Date(2000 + +m[3], +m[1] - 1, +m[2]).getTime() : 0;
  }

  // which page numbers to show: first, last, and two either side of the
  // current one, with gaps ("…") in between
  function pageNumbers(current, total){
    var out = [], last = 0;
    for (var p = 1; p <= total; p++){
      if (p === 1 || p === total || Math.abs(p - current) <= 2){
        if (last && p - last > 1) out.push(null);
        out.push(p);
        last = p;
      }
    }
    return out;
  }

  window.NOBLAE_paginate = function(list, selector, opts){
    opts = opts || {};
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll(selector))
      .filter(function(el){ return el.parentNode === list; });

    if (opts.sortByDate){
      items.forEach(function(el, i){ el._order = i; el._time = dateOf(el); });
      items.sort(function(a, b){ return (b._time - a._time) || (a._order - b._order); });
      items.forEach(function(el){ list.appendChild(el); });
    }

    var perPage = getPerPage();
    var page = getPageParam();

    // ---- controls above the list ----
    var bar = document.createElement('div');
    bar.className = 'pager-bar';
    var label = document.createElement('label');
    label.className = 'pager-size';
    label.appendChild(document.createTextNode('Show '));
    var select = document.createElement('select');
    OPTIONS.forEach(function(n){
      var o = document.createElement('option');
      o.value = n; o.textContent = n;
      if (n === perPage) o.selected = true;
      select.appendChild(o);
    });
    label.appendChild(select);
    label.appendChild(document.createTextNode(' per page'));
    var count = document.createElement('span');
    count.className = 'pager-count';
    bar.appendChild(label);
    bar.appendChild(count);
    list.parentNode.insertBefore(bar, list);

    // ---- page numbers below the list ----
    var nav = document.createElement('nav');
    nav.className = 'pager-nav';
    nav.setAttribute('aria-label', 'Pages');
    list.parentNode.insertBefore(nav, list.nextSibling);

    function button(text, target, opts2){
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      if (opts2 && opts2.label) b.setAttribute('aria-label', opts2.label);
      if (opts2 && opts2.current){ b.className = 'current'; b.setAttribute('aria-current', 'page'); }
      if (target === null) b.disabled = true;
      else b.addEventListener('click', function(){ go(target, true); });
      return b;
    }

    function render(){
      var total = items.length;
      var pages = Math.max(1, Math.ceil(total / perPage));
      if (page > pages) page = pages;
      var start = (page - 1) * perPage, end = Math.min(start + perPage, total);

      items.forEach(function(el, i){ el.hidden = i < start || i >= end; });
      count.textContent = total ? (start + 1) + '–' + end + ' of ' + total : '';
      bar.hidden = total === 0;

      nav.innerHTML = '';
      nav.hidden = pages < 2;
      if (pages < 2) return;
      nav.appendChild(button('‹', page > 1 ? page - 1 : null, { label: 'Previous page' }));
      pageNumbers(page, pages).forEach(function(p){
        if (p === null){
          var gap = document.createElement('span');
          gap.className = 'pager-gap';
          gap.textContent = '…';
          nav.appendChild(gap);
        } else {
          nav.appendChild(button(String(p), p, { current: p === page }));
        }
      });
      nav.appendChild(button('›', page < pages ? page + 1 : null, { label: 'Next page' }));
    }

    function go(p, scroll){
      page = p;
      setPageParam(page);
      render();
      if (scroll) bar.scrollIntoView({ block: 'start' });
    }

    select.addEventListener('change', function(){
      perPage = parseInt(select.value, 10);
      savePerPage(perPage);
      go(1, false);
    });

    render();
  };

  // lists written straight into the HTML (Poetry, Essays)
  document.addEventListener('DOMContentLoaded', function(){
    Array.prototype.slice.call(document.querySelectorAll('[data-paginate]')).forEach(function(list){
      window.NOBLAE_paginate(list, list.getAttribute('data-paginate'), {
        sortByDate: list.getAttribute('data-sort') === 'date'
      });
    });
  });
})();
