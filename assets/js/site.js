(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav scroll state */
  var nav = document.getElementById('nav');
  if (nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive:true });
  }

  /* Mobile nav toggle */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active section highlighting (only present on pages with in-page sections) */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  if (sections.length && navAnchors.length){
    var sectionObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          navAnchors.forEach(function(a){
            var href = a.getAttribute('href') || '';
            a.classList.toggle('active', href.indexOf('#' + entry.target.id) !== -1 && href.indexOf('.html') === -1);
          });
        }
      });
    }, { rootMargin:'-40% 0px -50% 0px' });
    sections.forEach(function(s){ sectionObserver.observe(s); });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.08 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  }

  /* Scroll progress bar */
  var progress = document.getElementById('scroll-progress');
  if (progress){
    window.addEventListener('scroll', function(){
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = (scrolled || 0) + '%';
    }, { passive:true });
  }

  /* Live IST clock (footer) */
  var timeEl = document.getElementById('local-time');
  if (timeEl){
    function updateTime(){
      var now = new Date();
      var opts = { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', hour12:false };
      timeEl.textContent = new Intl.DateTimeFormat('en-GB', opts).format(now) + ' IST';
    }
    updateTime();
    setInterval(updateTime, 30000);
  }

  /* Hero role rotator (home page only) */
  var roles = ['Reinforcement Learning', 'Computer Vision', 'Backend Systems', 'AI Research'];
  var roleEl = document.getElementById('role-rotator');
  var ri = 0;
  if (roleEl && !reduceMotion){
    setInterval(function(){
      ri = (ri + 1) % roles.length;
      roleEl.style.opacity = 0;
      setTimeout(function(){
        roleEl.textContent = roles[ri];
        roleEl.style.opacity = 1;
      }, 300);
    }, 2600);
  }

  /* Case-study quick-contents active state */
  var tocLinks = document.querySelectorAll('.case-toc a');
  var tocSections = [];
  tocLinks.forEach(function(a){
    var id = (a.getAttribute('href') || '').replace('#','');
    var el = document.getElementById(id);
    if (el) tocSections.push({ id:id, el:el, link:a });
  });
  if (tocSections.length){
    var tocObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var match = tocSections.find(function(s){ return s.el === entry.target; });
        if (match && entry.isIntersecting){
          tocLinks.forEach(function(a){ a.classList.remove('active'); });
          match.link.classList.add('active');
        }
      });
    }, { rootMargin:'-20% 0px -70% 0px' });
    tocSections.forEach(function(s){ tocObserver.observe(s.el); });
  }
})();
