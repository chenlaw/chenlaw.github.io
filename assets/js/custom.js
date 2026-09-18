// 鼠标滑动轨迹 + 返回顶部
(function () {
  // ---------- 鼠标轨迹 ----------
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var particles = [];
  var COLORS = ['#fff8e7', '#ffe9b3', '#ffd97a', '#f5c542', '#ffffff'];
  var colorIdx = 0;

  document.addEventListener('mousemove', function (e) {
    colorIdx = (colorIdx + 1) % COLORS.length;
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 2 + 1,
      life: 1,
      color: COLORS[colorIdx],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
    if (particles.length > 80) particles.shift();
  });

  // 触摸设备也支持
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    if (!t) return;
    particles.push({
      x: t.clientX,
      y: t.clientY,
      size: Math.random() * 2 + 1,
      life: 1,
      color: COLORS[colorIdx],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
    if (particles.length > 80) particles.shift();
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= 0.02;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life * 0.7;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f5c542';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();

  // ---------- 返回顶部 ----------
  var backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', '返回顶部');
  backToTop.style.cssText =
    'position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border-radius:50%;' +
    'background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;cursor:pointer;' +
    'font-size:1.25rem;box-shadow:0 4px 14px rgba(99,102,241,0.4);z-index:9999;' +
    'opacity:0;pointer-events:none;transform:translateY(12px);' +
    'transition:opacity 0.3s ease,transform 0.3s ease;';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.style.opacity = '1';
      backToTop.style.pointerEvents = 'auto';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.pointerEvents = 'none';
      backToTop.style.transform = 'translateY(12px)';
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
