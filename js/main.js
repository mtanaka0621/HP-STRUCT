/* =====================================================
   STRUCT - Main JavaScript
   役割: ナビゲーション / アニメーション / ヒーロー演出
   構成:
     1. ナビバー スクロール制御
     2. SPメニュー（モバイル）
     3. PC ドロップダウンメニュー
     4. スムーススクロール
     5. スクロールリビール（AOS 互換）
     6. FAQ アコーディオン
     7. チャートバー アニメーション
     8. KPI カウントアップ（ヒーローダッシュボード外）
     9. プログレスバー アニメーション
    10. アクティブナビリンク
    11. ヒーローキャンバス（空・雲エンジン）
    12. SIV 接続線描画
    13. カーソルグロー
    14. ヒーロー 3D チルト
    15. ヒーロー KPI カウントアップ
    16. ヒーロー 統計カウントアップ
    17. ヒーロー SVG ラインチャート
    18. アクティビティフィード サイクル
    19. フローティングカード 入場アニメーション
    20. フィーチャーカード ホバーエフェクト
    21. フローティングカード アニメーション遅延
    22. モバイル ドロップダウン
    23. KPI セクション スクロールトリガー
    24. ナビリンク アクティブ状態
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. ナビバー スクロール制御
  //    スクロール量が20pxを超えたら .scrolled クラスを付与し
  //    背景をブラー付き白に切り替える
  // ===================================================================
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // 初期状態を反映


  // ===================================================================
  // 2. SP メニュー（モバイル専用スライドインメニュー）
  //    iOS Safari の 300ms クリック遅延を touchstart/touchend で回避
  // ===================================================================
  const hamburger     = document.getElementById('hamburger');
  const spMenu        = document.getElementById('spMenu');
  const spOverlay     = document.getElementById('spOverlay');
  const spMenuClose   = document.getElementById('spMenuClose');
  const spFeatureBtn  = document.getElementById('spFeatureBtn');
  const spFeatureItem = document.getElementById('spFeatureItem');

  /** モバイル判定（768px 以下） */
  const isMobile = () => window.innerWidth <= 768;

  /** メニューを開く */
  const openSpMenu = () => {
    if (!spMenu) return;
    spMenu.classList.add('is-open');
    spMenu.setAttribute('aria-hidden', 'false');
    if (spOverlay) spOverlay.classList.add('is-open');
    hamburger.classList.add('active');
    // スクロールを抑止
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  /** メニューを閉じる（サブメニューも同時にリセット） */
  const closeSpMenu = () => {
    if (!spMenu) return;
    spMenu.classList.remove('is-open');
    spMenu.setAttribute('aria-hidden', 'true');
    if (spOverlay) spOverlay.classList.remove('is-open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (spFeatureItem) spFeatureItem.classList.remove('is-sub-open');
  };

  // ハンバーガーボタン：touch → click の二重発火を防ぐ
  if (hamburger) {
    let hamburgerTouched = false;

    hamburger.addEventListener('touchstart', (e) => {
      hamburgerTouched = true;
      e.stopPropagation();
    }, { passive: true });

    hamburger.addEventListener('touchend', (e) => {
      if (!hamburgerTouched) return;
      hamburgerTouched = false;
      e.preventDefault(); // 300ms のクリック遅延を防止
      e.stopPropagation();
      spMenu && spMenu.classList.contains('is-open') ? closeSpMenu() : openSpMenu();
    });

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hamburgerTouched) { hamburgerTouched = false; return; } // touchend 処理済みはスキップ
      spMenu && spMenu.classList.contains('is-open') ? closeSpMenu() : openSpMenu();
    });
  }

  // ×ボタン
  if (spMenuClose) {
    spMenuClose.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    spMenuClose.addEventListener('click', closeSpMenu);
  }

  // オーバーレイクリックで閉じる
  if (spOverlay) spOverlay.addEventListener('click', closeSpMenu);

  // 「機能」アコーディオン
  if (spFeatureBtn && spFeatureItem) {
    spFeatureBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      spFeatureItem.classList.toggle('is-sub-open');
    });
  }

  // メニュー内リンクをクリックしたら閉じる
  if (spMenu) {
    spMenu.querySelectorAll('.sp-submenu-item').forEach(link => link.addEventListener('click', closeSpMenu));
    spMenu.querySelectorAll('.sp-menu-link:not(.sp-menu-link--accordion)').forEach(link => link.addEventListener('click', closeSpMenu));
    spMenu.querySelectorAll('.sp-menu-cta').forEach(link => link.addEventListener('click', closeSpMenu));
  }


  // ===================================================================
  // 3. PC ドロップダウンメニュー（ホバー制御）
  //    mouseleave から 150ms のタイマーで閉じることで
  //    隙間通過によるちらつきを防ぐ
  // ===================================================================
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  dropdownItems.forEach(item => {
    let closeTimer = null;

    const openDropdown = () => {
      if (isMobile()) return;
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      // 他のドロップダウンを閉じる
      dropdownItems.forEach(other => {
        if (other !== item) other.classList.remove('dropdown-open');
      });
      item.classList.add('dropdown-open');
    };

    const scheduleClose = () => {
      if (isMobile()) return;
      closeTimer = setTimeout(() => {
        item.classList.remove('dropdown-open');
        closeTimer = null;
      }, 150);
    };

    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', scheduleClose);

    // ドロップダウン本体にも同じイベントを付与（隙間対策）
    const menu = item.querySelector('.dropdown-menu');
    if (menu) {
      menu.addEventListener('mouseenter', openDropdown);
      menu.addEventListener('mouseleave', scheduleClose);
    }
  });

  // ドロップダウン外クリックで全て閉じる
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
    }
  });


  // ===================================================================
  // 4. スムーススクロール
  //    ナビバー分（80px）のオフセットを加算
  // ===================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ===================================================================
  // 5. スクロールリビール（AOS 互換）
  //    [data-aos] 要素がビューポート下端 85% に入ったら
  //    .aos-animate を付与して CSS トランジションを発火
  // ===================================================================
  const aosElements = document.querySelectorAll('[data-aos]');

  const revealOnScroll = () => {
    const triggerPoint = window.scrollY + window.innerHeight * 0.85;
    aosElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top + window.scrollY;
      if (elementTop < triggerPoint) el.classList.add('aos-animate');
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  setTimeout(revealOnScroll, 100); // 初期チェック


  // ===================================================================
  // 6. FAQ アコーディオン
  //    クリックした項目を開き、他は閉じる（1つのみ展開）
  // ===================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(fi => fi.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });


  // ===================================================================
  // 7. チャートバー アニメーション
  //    ページロード後 800ms でバーを順番にフェードイン
  // ===================================================================
  const animateChartBars = () => {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, i) => setTimeout(() => { bar.style.opacity = '1'; }, i * 100));
  };
  setTimeout(animateChartBars, 800);


  // ===================================================================
  // 8. KPI カウントアップ（ヒーローダッシュボード外の旧実装）
  //    イージング付きで数値を 0 からアニメーション
  // ===================================================================
  const animateCountUp = (element, target, suffix = '', duration = 1500) => {
    const startTime = performance.now();
    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  // ヒーローダッシュボードが表示領域に入ったらトリガー
  const heroObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    const kpiValues = document.querySelectorAll('.kpi-value');
    const kpiData   = [
      { value: 147,  suffix: 'M'  },
      { value: 92.4, suffix: '%'  },
      { value: 124,  suffix: '名' },
      { value: 38,   suffix: '件' },
    ];
    kpiValues.forEach((el, i) => {
      const data = kpiData[i];
      if (!data) return;
      if (data.value % 1 !== 0) {
        // 小数値（アニメーション付き）
        const startTime = performance.now();
        const update = (now) => {
          const progress = Math.min((now - startTime) / 1500, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = (i === 0 ? '¥' : '') + (data.value * eased).toFixed(1) + data.suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      } else {
        el.textContent = (i === 0 ? '¥' : '') + '0' + data.suffix;
        setTimeout(() => animateCountUp(el, data.value, data.suffix), 200 * i);
      }
    });
    heroObserver.disconnect();
  }, { threshold: 0.3 });

  const heroDashboard = document.querySelector('.hero-dashboard');
  if (heroDashboard) heroObserver.observe(heroDashboard);


  // ===================================================================
  // 9. プログレスバー アニメーション
  //    バーが表示領域に入った瞬間に幅を 0→target へトランジション
  // ===================================================================
  const progressBars = document.querySelectorAll('.mk-fill, .dm-fill, .psl-fill');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = targetWidth;
      }, 100);
      progressObserver.unobserve(bar);
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));


  // ===================================================================
  // 10. アクティブナビリンク（スクロール位置に応じて強調）
  //     スクロール位置 + 100px でセクション判定
  // ===================================================================
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // ===================================================================
  // 11. ヒーローキャンバス — 空・雲エンジン
  //     Canvas 上に雲・光粒子・光線・虹・飛行機・花火を描画
  //     マウスクリックで花火打ち上げ、ビューポート外では停止
  // ===================================================================
  initHeroCanvas();

  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, animId;
    let mx = -999, my = -999; // マウス座標（ヒーロー相対）
    let isVisible = true;

    // --- カラーパレット ---
    const SKY_TOP      = [220, 238, 255]; // 薄い水色
    const SKY_MID      = [235, 245, 255]; // 明るい空色
    const CLOUD_WHITE  = [255, 255, 255];
    const CLOUD_SHADOW = [200, 215, 240]; // 影の青みがかったグレー

    /** キャンバスを sky-stage（ヒーロー＋アサインの統合空背景）に合わせる */
    function resize() {
      const stage = document.querySelector('.sky-stage')
                 || document.querySelector('.hero-section');
      W = canvas.width  = stage.offsetWidth;
      H = canvas.height = stage.offsetHeight;
    }
    window.addEventListener('resize', () => { resize(); buildAll(); });
    resize();

    // ─── ユーティリティ関数 ─────────────────────────────
    /** rgba文字列を生成 */
    const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a.toFixed(3)})`;
    /** 線形補間 */
    const lerp = (a, b, t) => a + (b - a) * t;
    /** 乱数（範囲指定） */
    const rnd  = (min, max) => min + Math.random() * (max - min);


    // =====================================================
    // Cloud クラス — ふわふわ浮かぶ雲
    // =====================================================
    class Cloud {
      constructor(init) { this.reset(init); }

      reset(init) {
        // 初期配置は画面内ランダム、再生成は左外から流れてくる
        this.x     = init ? rnd(-200, W + 200) : rnd(-400, -80);
        // 雲は sky-stage 全体（縦長）に万遍なく分布させる
        this.y     = rnd(H * 0.02, H * 0.92);
        this.speed = rnd(0.12, 0.38);
        this.scale = rnd(0.5, 1.8);
        this.alpha = rnd(0.65, 0.92);
        this.phase      = Math.random() * Math.PI * 2; // 上下揺れ位相
        this.phaseSpeed = rnd(0.003, 0.009);

        // 雲の形状：複数の円の集合
        const count  = Math.floor(rnd(4, 9));
        const baseR  = rnd(28, 65) * this.scale;
        this.puffs   = [];
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 1.6 - Math.PI * 0.3;
          const dist  = baseR * rnd(0.3, 0.85);
          this.puffs.push({
            ox: Math.cos(angle) * dist,
            oy: Math.sin(angle) * dist * 0.45,
            r:  baseR * rnd(0.55, 1.0),
          });
        }
        this.puffs.push({ ox: 0, oy: 0, r: baseR }); // 中心の大きいパフ

        // 影の色（柔らかいブルーグレー）
        const ss = rnd(0.06, 0.18);
        this.shadowColor = rgba(
          Math.floor(lerp(CLOUD_SHADOW[0], CLOUD_WHITE[0], 0.5)),
          Math.floor(lerp(CLOUD_SHADOW[1], CLOUD_WHITE[1], 0.5)),
          Math.floor(lerp(CLOUD_SHADOW[2], CLOUD_WHITE[2], 0.5)),
          ss
        );

        this.mouseInfluence = 0;
      }

      update() {
        this.x += this.speed;
        this.phase += this.phaseSpeed;
        const floatY = Math.sin(this.phase) * 4 * this.scale;

        // マウス近接で穏やかに反応（220px 以内）
        const dx   = mx - this.x;
        const dy   = my - (this.y + floatY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          this.mouseInfluence = 1 - dist / 220;
          this.x += dx / dist * this.mouseInfluence * 0.18;
        } else {
          this.mouseInfluence = 0;
        }

        this._drawY = this.y + floatY;

        // 右端を超えたらリセット
        const maxR = Math.max(...this.puffs.map(p => Math.abs(p.ox) + p.r));
        if (this.x - maxR > W + 100) this.reset(false);
      }

      draw() {
        const x = this.x;
        const y = this._drawY || this.y;
        const a = this.alpha + this.mouseInfluence * 0.08;

        ctx.save();

        // 影レイヤー（少し下にオフセット）
        for (const p of this.puffs) {
          const grad = ctx.createRadialGradient(
            x + p.ox, y + p.oy + p.r * 0.35, p.r * 0.1,
            x + p.ox, y + p.oy + p.r * 0.35, p.r * 1.1
          );
          grad.addColorStop(0, rgba(CLOUD_SHADOW[0], CLOUD_SHADOW[1], CLOUD_SHADOW[2], a * 0.30));
          grad.addColorStop(1, rgba(CLOUD_SHADOW[0], CLOUD_SHADOW[1], CLOUD_SHADOW[2], 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x + p.ox, y + p.oy + p.r * 0.35, p.r * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }

        // 雲本体：各パフをラジアルグラデーションで描画（立体感）
        for (const p of this.puffs) {
          const grad = ctx.createRadialGradient(
            x + p.ox - p.r * 0.12, y + p.oy - p.r * 0.18, p.r * 0.05, // 光源（左上）
            x + p.ox, y + p.oy, p.r
          );
          grad.addColorStop(0,    rgba(255, 255, 255, a));
          grad.addColorStop(0.35, rgba(252, 255, 255, a * 0.97));
          grad.addColorStop(0.65, rgba(235, 245, 255, a * 0.85));
          grad.addColorStop(0.85, rgba(215, 233, 252, a * 0.45));
          grad.addColorStop(1,    rgba(200, 225, 250, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x + p.ox, y + p.oy, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }


    // =====================================================
    // Dust クラス — 空気感の光の粒
    // =====================================================
    class Dust {
      constructor(init) { this.reset(init); }

      reset(init) {
        this.x          = rnd(0, W);
        this.y          = rnd(0, H);
        this.vx         = rnd(-0.15, 0.15);
        this.vy         = rnd(-0.25, -0.05); // ゆっくり上昇
        this.r          = rnd(0.8, 2.5);
        this.phase      = Math.random() * Math.PI * 2;
        this.phaseSpeed = rnd(0.01, 0.03);
        this.maxA       = rnd(0.12, 0.35);
      }

      update() {
        this.x     += this.vx;
        this.y     += this.vy;
        this.phase += this.phaseSpeed;
        this.a      = (Math.sin(this.phase) * 0.5 + 0.5) * this.maxA;
        // 端に達したらループ
        if (this.y < -10)    this.reset(false);
        if (this.x < -10)    this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
      }

      draw() {
        if (this.a <= 0.01) return;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
        g.addColorStop(0,   rgba(180, 210, 255, this.a));
        g.addColorStop(0.5, rgba(200, 220, 255, this.a * 0.4));
        g.addColorStop(1,   rgba(220, 235, 255, 0));
        ctx.save();
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }


    // =====================================================
    // LightRay クラス — 神秘的な薄い光の筋
    // =====================================================
    class LightRay {
      constructor() { this.reset(); }

      reset() {
        this.x          = rnd(W * 0.1, W * 0.9);
        this.angle      = rnd(-0.3, 0.3); // ほぼ垂直
        this.width      = rnd(30, 90);
        this.len        = rnd(H * 0.4, H * 0.85);
        this.a          = 0;
        this.maxA       = rnd(0.04, 0.10);
        this.phase      = Math.random() * Math.PI * 2;
        this.phaseSpeed = rnd(0.004, 0.010);
        this.delay      = rnd(0, 200);
      }

      update() {
        if (this.delay > 0) { this.delay--; return; }
        this.phase += this.phaseSpeed;
        this.a      = (Math.sin(this.phase) * 0.5 + 0.5) * this.maxA;
      }

      draw() {
        if (this.delay > 0 || this.a < 0.005) return;
        ctx.save();
        ctx.translate(this.x, 0);
        ctx.rotate(this.angle);
        const grad = ctx.createLinearGradient(0, 0, 0, this.len);
        grad.addColorStop(0,   rgba(255, 250, 220, this.a * 0.9));
        grad.addColorStop(0.3, rgba(240, 248, 255, this.a * 0.6));
        grad.addColorStop(1,   rgba(220, 240, 255, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.lineTo( this.width / 2, 0);
        ctx.lineTo( this.width * 0.35, this.len);
        ctx.lineTo(-this.width * 0.35, this.len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }


    // =====================================================
    // Rainbow クラス — 薄い虹（空の彩り）
    // =====================================================
    class Rainbow {
      constructor() {
        // 初期はステージ0（未出現・待機中）
        // ステージ: 0=待機 → 1=フェードイン → 2=表示 → 3=フェードアウト
        this.stage      = 0;
        // 最初に出現するまでの待機時間（フレーム数 / 約60fps）
        // 7秒後に初出現（フェードイン開始）
        this.waitFrames = 7 * 60;
        this.timer      = 0;
        this.alphaMul   = 0; // 全体アルファ倍率（0〜1）
        this.fadeInDur  = 4 * 60;   // フェードイン 4秒
        this.fadeOutDur = 5 * 60;   // フェードアウト 5秒
        this.holdDur    = Math.floor(rnd(10 * 60, 18 * 60)); // 表示維持 10〜18秒
        this.spawn(); // 位置・パラメータを初期化
      }

      // 位置・サイズなど見た目の再抽選（新しい虹を出すたびに呼ぶ）
      spawn() {
        this.cx         = rnd(W * 0.2, W * 0.8);
        this.cy         = rnd(H * 0.3, H * 0.6);
        this.r1         = rnd(150, 280);
        this.phase      = Math.random() * Math.PI * 2;
        this.phaseSpeed = rnd(0.002, 0.006);
      }

      update() {
        this.phase += this.phaseSpeed;
        this.timer++;

        switch (this.stage) {
          case 0: // 待機中（未出現）
            if (this.timer >= this.waitFrames) {
              this.spawn();           // 位置を新たに決定
              this.stage = 1;
              this.timer = 0;
            }
            break;
          case 1: // フェードイン
            this.alphaMul = Math.min(1, this.timer / this.fadeInDur);
            if (this.timer >= this.fadeInDur) {
              this.stage = 2;
              this.timer = 0;
            }
            break;
          case 2: // 表示維持
            this.alphaMul = 1;
            if (this.timer >= this.holdDur) {
              this.stage = 3;
              this.timer = 0;
            }
            break;
          case 3: // フェードアウト
            this.alphaMul = Math.max(0, 1 - this.timer / this.fadeOutDur);
            if (this.timer >= this.fadeOutDur) {
              // 次に出るまで長めに休む（25〜45秒）
              this.stage      = 0;
              this.timer      = 0;
              this.alphaMul   = 0;
              this.waitFrames = Math.floor(rnd(25 * 60, 45 * 60));
              this.holdDur    = Math.floor(rnd(10 * 60, 18 * 60));
            }
            break;
        }
      }

      draw() {
        // 待機中は描画しない
        if (this.stage === 0 || this.alphaMul <= 0) return;
        // 元の濃度（最大0.06）を少しだけ濃く（最大0.14）
        // ライフサイクルのフェード倍率を掛ける
        const a = ((Math.sin(this.phase) * 0.5 + 0.5) * 0.14 + 0.04) * this.alphaMul;
        if (a < 0.02) return;
        const colors = [
          [255,160,120], [255,220,100], [160,230,140],
          [100,200,240], [160,140,255], [230,140,220],
        ];
        ctx.save();
        colors.forEach((c, i) => {
          ctx.strokeStyle = rgba(c[0], c[1], c[2], a);
          ctx.lineWidth   = 12;
          ctx.beginPath();
          ctx.arc(this.cx, this.cy, this.r1 + i * 14, Math.PI, Math.PI * 2);
          ctx.stroke();
        });
        ctx.restore();
      }
    }


    // =====================================================
    // Airplane クラス — 飛行機（コントレイル付き）
    // =====================================================
    class Airplane {
      constructor(init) { this.reset(init); }

      reset(init) {
        const fromLeft = Math.random() > 0.25; // 75%は左→右
        this.dir   = fromLeft ? 1 : -1;
        this.x     = init ? rnd(0, W) : (fromLeft ? rnd(-300, -80) : rnd(W + 80, W + 300));
        // 高度を sky-stage 全体（縦長）に分布させる
        this.y     = rnd(H * 0.04, H * 0.85);
        this.speed = rnd(0.7, 1.8);
        // スケールを大きく強化（0.55〜1.1 → 1.4〜2.4）
        this.scale = rnd(1.4, 2.4);
        // 透明度も上げて視認性UP（0.70〜0.92 → 0.88〜1.0）
        this.alpha = rnd(0.88, 1.0);
        this.trail       = [];
        this.trailMaxLen = Math.floor(rnd(60, 140));
        this.phase      = Math.random() * Math.PI * 2;
        this.phaseSpeed = rnd(0.008, 0.018);
        this.floatAmp   = rnd(0.4, 1.2);
      }

      update() {
        this.x     += this.speed * this.dir;
        this.phase += this.phaseSpeed;
        this.y     += Math.sin(this.phase) * this.floatAmp * 0.08;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailMaxLen) this.trail.shift();
        // 画面外に出たらリセット
        if (this.dir === 1  && this.x >  W + 300) this.reset(false);
        if (this.dir === -1 && this.x < -300)      this.reset(false);
      }

      draw() {
        if (this.trail.length < 2) return;
        const { x, y, scale: s, alpha: a } = this;

        ctx.save();

        // コントレイル（飛行機雲）描画 — 太く明確に
        const tLen = this.trail.length;
        for (let i = 1; i < tLen; i++) {
          const t0    = this.trail[i - 1];
          const t1    = this.trail[i];
          const prog  = i / tLen;
          // 先端ほど細く、末端ほど太く拡散（線幅と濃度を増強）
          const trailW = (1 - prog) * 9 * s + 1.0;
          const trailA = prog * a * 0.85 * (1 - (1 - prog) * 0.4);
          const grad   = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y);
          grad.addColorStop(0, rgba(235, 245, 255, trailA * 0.75));
          grad.addColorStop(1, rgba(255, 255, 255, trailA));
          ctx.strokeStyle = grad;
          ctx.lineWidth   = trailW;
          ctx.lineCap     = 'round';
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.stroke();
        }

        // 機体描画（SVG ライクなパス）
        ctx.translate(x, y);
        if (this.dir === -1) ctx.scale(-1, 1); // 左向きは反転
        ctx.scale(s, s);
        ctx.globalAlpha = a;

        // 胴体
        ctx.fillStyle   = rgba(250, 252, 255, 1);
        ctx.strokeStyle = rgba(180, 200, 240, 0.9);
        ctx.lineWidth   = 0.8 / s;
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.bezierCurveTo(-22, -4, 10, -5, 28, 0);
        ctx.bezierCurveTo( 10,  5,-22,  4,-28, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 主翼（上）
        ctx.fillStyle = rgba(240, 247, 255, 0.97);
        ctx.beginPath();
        ctx.moveTo(  2, -1); ctx.lineTo(-4, -18); ctx.lineTo(-10, -18); ctx.lineTo(-6, -1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 主翼（下）
        ctx.beginPath();
        ctx.moveTo(  2,  1); ctx.lineTo(-4,  18); ctx.lineTo(-10,  18); ctx.lineTo(-6,  1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 水平尾翼（上）
        ctx.beginPath();
        ctx.moveTo(-22, -1); ctx.lineTo(-26, -7); ctx.lineTo(-28, -7); ctx.lineTo(-26, -1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 水平尾翼（下）
        ctx.beginPath();
        ctx.moveTo(-22,  1); ctx.lineTo(-26,  7); ctx.lineTo(-28,  7); ctx.lineTo(-26,  1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 垂直尾翼
        ctx.beginPath();
        ctx.moveTo(-21, 0); ctx.lineTo(-25, -9); ctx.lineTo(-27, -9); ctx.lineTo(-24, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 窓（5個）
        ctx.fillStyle = rgba(180, 215, 255, 0.7);
        for (let wi = 0; wi < 5; wi++) {
          ctx.beginPath();
          ctx.arc(-2 + wi * 4.5, -2.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }


    // =====================================================
    // 花火システム
    // =====================================================

    /** 花火のカラーパレット */
    const FW_PALETTES = [
      ['#FF6B9D','#FF8FB1','#FFB3CC'], // ピンク系
      ['#A78BFA','#C4B5FD','#DDD6FE'], // パープル系
      ['#34D399','#6EE7B7','#A7F3D0'], // グリーン系
      ['#60A5FA','#93C5FD','#BFDBFE'], // ブルー系
      ['#FBBF24','#FCD34D','#FDE68A'], // ゴールド系
      ['#F87171','#FCA5A5','#FECACA'], // レッド系
      ['#2DD4BF','#5EEAD4','#99F6E4'], // ティール系
      ['#FB7185','#A78BFA','#60A5FA'], // 三色ミックス
    ];

    /** 花火の粒子 */
    class FireworkParticle {
      constructor(x, y, angle, speed, color, type) {
        this.x = x; this.y = y;
        this.vx    = Math.cos(angle) * speed;
        this.vy    = Math.sin(angle) * speed;
        this.color = color;
        this.type  = type; // 'star' | 'trail' | 'sparkle'
        this.a     = 1.0;
        this.r       = type === 'star' ? rnd(2.5, 4.5) : rnd(1.0, 2.5);
        this.gravity = 0.06;
        this.drag    = type === 'star' ? 0.97 : 0.94;
        this.twinkle = Math.random() * Math.PI * 2;
        this.tail    = [];
        this.tailMax = type === 'star' ? 8 : 4;
        this.canBurst = type === 'star' && Math.random() < 0.15; // 二次爆発フラグ
        this.hasBurst = false;
      }

      update() {
        this.tail.push({ x: this.x, y: this.y, a: this.a });
        if (this.tail.length > this.tailMax) this.tail.shift();
        this.x      += this.vx;
        this.y      += this.vy;
        this.vy     += this.gravity;
        this.vx     *= this.drag;
        this.vy     *= this.drag;
        this.twinkle += 0.25;
        this.a      -= this.type === 'star' ? 0.016 : 0.028;
        return this.a > 0;
      }

      draw() {
        // 残光
        this.tail.forEach((t, i) => {
          const ta = (i / this.tail.length) * t.a * 0.4;
          if (ta < 0.01) return;
          ctx.save();
          ctx.globalAlpha = ta;
          ctx.fillStyle   = this.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        // 本体（グロー + 白コア）
        const tw = Math.sin(this.twinkle) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = this.a * tw;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
        g.addColorStop(0,   this.color + 'ff');
        g.addColorStop(0.4, this.color + '88');
        g.addColorStop(1,   this.color + '00');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    /** 打ち上げロケット */
    class FireworkRocket {
      constructor(tx, ty, startX) {
        this.x = startX !== undefined ? startX : tx + rnd(-30, 30);
        this.y = H + 10;
        this.tx = tx;
        this.ty = ty;
        const dist  = Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2);
        const speed = rnd(14, 20);
        this.vx = (tx - this.x) / dist * speed;
        this.vy = (ty - this.y) / dist * speed;
        this.a       = 1.0;
        this.trail   = [];
        this.exploded = false;
        this.color   = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)][0];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 16) this.trail.shift();
        this.x  += this.vx;
        this.y  += this.vy;
        this.vy += 0.4; // 重力
        // 目標高度付近または上昇が止まったら爆発
        if (this.vy >= 0 || this.y <= this.ty) this.exploded = true;
      }

      draw() {
        // 打ち上げ軌跡
        for (let i = 1; i < this.trail.length; i++) {
          const t0   = this.trail[i - 1];
          const t1   = this.trail[i];
          const prog = i / this.trail.length;
          const g    = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y);
          g.addColorStop(0, this.color + '00');
          g.addColorStop(1, this.color + Math.floor(prog * 180).toString(16).padStart(2, '0'));
          ctx.save();
          ctx.strokeStyle = g;
          ctx.lineWidth   = 2.5 * prog;
          ctx.lineCap     = 'round';
          ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.stroke();
          ctx.restore();
        }
        // 先頭グロー
        const hg = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 8);
        hg.addColorStop(0,   '#ffffffcc');
        hg.addColorStop(0.4, this.color + 'aa');
        hg.addColorStop(1,   this.color + '00');
        ctx.save();
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(this.x, this.y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    /** 花火全体管理クラス（爆発パターン：球形/菊/ウィロー/クロスター） */
    class Firework {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.particles = [];
        this.done      = false;
        const palette = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)];
        const type    = Math.floor(Math.random() * 4); // 0:球形 1:菊 2:ウィロー 3:クロスター
        const count   = type === 2 ? 80 : type === 3 ? 60 : 100;

        for (let i = 0; i < count; i++) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          let angle, speed;
          if (type === 0) {
            angle = (i / count) * Math.PI * 2 + rnd(-0.1, 0.1);
            speed = rnd(3.5, 7.5);
          } else if (type === 1) {
            angle = (i / count) * Math.PI * 2;
            speed = rnd(4, 8) * (0.7 + Math.abs(Math.sin(angle * 6)) * 0.6);
          } else if (type === 2) {
            angle = (i / count) * Math.PI * 2;
            speed = rnd(2, 5.5);
          } else {
            angle = rnd(0, Math.PI * 2);
            speed = rnd(1.5, 7);
          }
          const ptype = type === 2 ? 'trail' : (Math.random() < 0.15 ? 'sparkle' : 'star');
          this.particles.push(new FireworkParticle(x, y, angle, speed, color, ptype));
        }
        // 二次爆発用の小粒
        const extras = Math.floor(rnd(8, 18));
        for (let i = 0; i < extras; i++) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          this.particles.push(new FireworkParticle(x, y, rnd(0, Math.PI * 2), rnd(0.5, 2.5), color, 'sparkle'));
        }
      }

      update() {
        this.particles = this.particles.filter(p => {
          // 二次爆発チェック
          if (p.canBurst && !p.hasBurst && p.a < 0.5) {
            p.hasBurst = true;
            const sub = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)];
            for (let i = 0; i < 12; i++) {
              const np = new FireworkParticle(
                p.x, p.y, rnd(0, Math.PI * 2), rnd(1.5, 3.5),
                sub[Math.floor(Math.random() * sub.length)], 'sparkle'
              );
              this.particles.push(np);
            }
          }
          return p.update();
        });
        if (this.particles.length === 0) this.done = true;
      }

      draw() { this.particles.forEach(p => p.draw()); }
    }

    // アクティブな花火・ロケットのリスト
    const FIREWORKS = [];
    const ROCKETS   = [];

    /**
     * 花火を打ち上げる（クリック位置に向けてロケット1〜3本）
     * @param {number} x - クリック X 座標（ヒーロー相対）
     * @param {number} y - クリック Y 座標（ヒーロー相対）
     */
    function launchFirework(x, y) {
      const count = Math.floor(rnd(1, 3.9));
      for (let i = 0; i < count; i++) {
        ROCKETS.push(new FireworkRocket(x + rnd(-60, 60) * i, y + rnd(-40, 40) * i * 0.5));
      }
    }


    // =====================================================
    // シーン初期化（buildAll）
    // =====================================================
    const CLOUDS   = [];
    const DUSTS    = [];
    const RAYS     = [];
    const RAINBOWS = [];
    const PLANES   = [];

    function buildAll() {
      CLOUDS.length = DUSTS.length = RAYS.length = RAINBOWS.length = PLANES.length = 0;
      // 雲の数を大幅増量：幅だけでなく高さも考慮（sky-stage で縦長になったため）
      // 以前：W / 130 で最低 10個 → 増量：(W * H) ベースで算出し最低 22個
      const area = W * H;
      const cloudCount = Math.max(22, Math.floor(area / 36000));
      for (let i = 0; i < cloudCount; i++) CLOUDS.push(new Cloud(true));
      // 光の粒（dust）も縦長に合わせて密度UP
      const dustCount = Math.max(Math.floor(W / 8), Math.floor(area / 9000));
      for (let i = 0; i < dustCount; i++) DUSTS.push(new Dust(true));
      // 光線も増量（7 → 10）
      for (let i = 0; i < 10; i++) RAYS.push(new LightRay());
      // 虹は同時に1つだけ（ライフサイクルにより時間経過で出現）
      RAINBOWS.push(new Rainbow());
      // 飛行機を増量：2〜3機 → 5〜7機
      const planeCount = Math.floor(rnd(5, 8));
      for (let i = 0; i < planeCount; i++) PLANES.push(new Airplane(true));
    }
    buildAll();

    // マウス座標追跡（hero-section 相対）
    const heroEl = document.querySelector('.hero-section');
    if (heroEl) {
      heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
      });
      heroEl.addEventListener('mouseleave', () => { mx = -999; my = -999; });
    }

    // クリック・タッチで花火打ち上げ
    const clickLayer = document.getElementById('heroClickLayer');
    const evTarget   = clickLayer || heroEl;
    if (evTarget) {
      evTarget.addEventListener('click', e => {
        const r  = (heroEl || evTarget).getBoundingClientRect();
        launchFirework(e.clientX - r.left, e.clientY - r.top);
      });
      evTarget.addEventListener('touchend', e => {
        e.preventDefault();
        const r = (heroEl || evTarget).getBoundingClientRect();
        const t = e.changedTouches[0];
        launchFirework(t.clientX - r.left, t.clientY - r.top);
      }, { passive: false });
    }

    // =====================================================
    // レンダーループ
    // =====================================================
    let frame = 0;
    function loop() {
      if (!isVisible) { animId = requestAnimationFrame(loop); return; }
      frame++;

      ctx.clearRect(0, 0, W, H); // キャンバスをクリア

      // 描画順: 光線 → 虹 → 雲（奥→手前）→ 光の粒 → 飛行機 → 花火
      RAYS.forEach(r => { r.update(); r.draw(); });
      RAINBOWS.forEach(r => { r.update(); r.draw(); });
      CLOUDS
        .sort((a, b) => a.scale - b.scale) // scale小さい=遠い
        .forEach(c => { c.update(); c.draw(); });
      DUSTS.forEach(d => { d.update(); d.draw(); });
      PLANES.forEach(p => { p.update(); p.draw(); });

      // ロケット更新（爆発したら Firework に変換）
      for (let i = ROCKETS.length - 1; i >= 0; i--) {
        ROCKETS[i].draw();
        ROCKETS[i].update();
        if (ROCKETS[i].exploded) {
          FIREWORKS.push(new Firework(ROCKETS[i].x, ROCKETS[i].y));
          ROCKETS.splice(i, 1);
        }
      }

      // 花火更新
      for (let i = FIREWORKS.length - 1; i >= 0; i--) {
        FIREWORKS[i].draw();
        FIREWORKS[i].update();
        if (FIREWORKS[i].done) FIREWORKS.splice(i, 1);
      }

      // マウス周辺の柔らかいグロー
      if (mx > 0 && mx < W) {
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
        mg.addColorStop(0,   rgba(200, 225, 255, 0.08));
        mg.addColorStop(0.5, rgba(230, 210, 255, 0.03));
        mg.addColorStop(1,   rgba(255, 255, 255, 0));
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    }
    loop();

    // ビューポート外では描画を停止して CPU 負荷を削減
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
      new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
      }).observe(heroSec);
    }
  } // end initHeroCanvas


  // ===================================================================
  // 12. SIV — 接続線描画
  //     各カードの縦中央からコア中央へ、コア下端からダッシュボードへ
  //     ベジェ曲線 + 破線 + アニメーションドットで表現
  // ===================================================================
  function drawSivLines() {
    const svg    = document.getElementById('sivLinesSvg');
    const wrap   = svg && svg.closest('.siv-wrap');
    const core   = document.getElementById('sivCore');
    const bottom = document.getElementById('sivBottom');
    const cards  = [1, 2, 3, 4, 5, 6].map(n => document.getElementById(`sivCard${n}`));

    if (!svg || !wrap || !core || !bottom) return;

    const wrapRect = wrap.getBoundingClientRect();
    if (wrapRect.width === 0 || wrapRect.height === 0) return; // 未レンダリングはスキップ

    // ─── 座標計算ヘルパー ─────────────────────────────
    /** wrap 左上基準の中央座標 */
    const relCenter = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - wrapRect.left + r.width / 2, y: r.top - wrapRect.top + r.height / 2 };
    };
    /** wrap 左上基準の右端座標（縦中央） */
    const relRight  = el => {
      const r = el.getBoundingClientRect();
      return { x: r.right - wrapRect.left, y: r.top - wrapRect.top + r.height / 2 };
    };
    /** wrap 左上基準の左端座標（縦中央） */
    const relLeft   = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - wrapRect.left, y: r.top - wrapRect.top + r.height / 2 };
    };
    /** wrap 左上基準の上端座標（横中央） */
    const relTop    = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - wrapRect.left + r.width / 2, y: r.top - wrapRect.top };
    };
    /** wrap 左上基準の下端座標（横中央） */
    const relBottom = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - wrapRect.left + r.width / 2, y: r.bottom - wrapRect.top };
    };

    const coreC       = relCenter(core);
    const dbTop       = relTop(bottom);
    const coreInnerEl = core.querySelector('.siv-core-inner');
    const coreBot     = coreInnerEl ? relBottom(coreInnerEl) : relBottom(core);

    // コア→DB ラインの X 座標（まっすぐ垂直に引く）
    const lineX = coreBot.x;

    // SVG サイズを wrap に合わせる
    const W = wrapRect.width;
    const H = wrapRect.height;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width',  W);
    svg.setAttribute('height', H);

    // カードカラー（カード 1〜6 の順）
    const colors = ['#EC4C86', '#6152FF', '#14b8a6', '#f97316', '#a855f7', '#22c55e'];

    // 既存の動的要素を削除（defs は残す）
    svg.querySelectorAll('.siv-dyn').forEach(el => el.remove());

    const ns = 'http://www.w3.org/2000/svg';

    // ── カード → コア の接続線 ──
    cards.forEach((card, i) => {
      if (!card) return;
      const isLeft = i < 3; // 左側カードは右端、右側カードは左端から引く
      const pt     = isLeft ? relRight(card) : relLeft(card);
      const color  = colors[i];

      // 緩やかなベジェ曲線のコントロールポイント
      const cx1 = isLeft
        ? pt.x + (coreC.x - pt.x) * 0.55
        : pt.x - (pt.x - coreC.x) * 0.55;
      const cx2 = isLeft
        ? coreC.x - (coreC.x - pt.x) * 0.15
        : coreC.x + (pt.x - coreC.x) * 0.15;
      const d = `M${pt.x},${pt.y} C${cx1},${pt.y} ${cx2},${coreC.y} ${coreC.x},${coreC.y}`;

      // グロー（太め・低透明度）
      const pathGlow = document.createElementNS(ns, 'path');
      pathGlow.setAttribute('d', d);
      pathGlow.setAttribute('fill', 'none');
      pathGlow.setAttribute('stroke', color);
      pathGlow.setAttribute('stroke-width', '4');
      pathGlow.setAttribute('stroke-opacity', '0.12');
      pathGlow.setAttribute('stroke-linecap', 'round');
      pathGlow.classList.add('siv-dyn');
      svg.appendChild(pathGlow);

      // 破線（本線）
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-opacity', '0.75');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-dasharray', '5 4');
      path.setAttribute('filter', 'url(#siv-glow)');
      path.classList.add('siv-dyn', 'siv-line');
      svg.appendChild(path);

      // アニメーションドット（パス上を移動）
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', color);
      dot.setAttribute('filter', 'url(#siv-glow)');
      dot.classList.add('siv-dyn');
      const animMotion = document.createElementNS(ns, 'animateMotion');
      animMotion.setAttribute('dur', `${2.0 + i * 0.3}s`);
      animMotion.setAttribute('repeatCount', 'indefinite');
      animMotion.setAttribute('begin', `${i * 0.4}s`);
      animMotion.setAttribute('path', d);
      dot.appendChild(animMotion);
      svg.appendChild(dot);
    });

    // ── コア → ダッシュボード の点線（垂直） ──
    const dxDb = `M${lineX},${coreBot.y} L${lineX},${dbTop.y}`;

    // グロー
    const dbGlow = document.createElementNS(ns, 'path');
    dbGlow.setAttribute('d', dxDb);
    dbGlow.setAttribute('fill', 'none');
    dbGlow.setAttribute('stroke', '#a855f7');
    dbGlow.setAttribute('stroke-width', '5');
    dbGlow.setAttribute('stroke-opacity', '0.12');
    dbGlow.setAttribute('stroke-linecap', 'round');
    dbGlow.classList.add('siv-dyn');
    svg.appendChild(dbGlow);

    // 矢印マーカー定義
    const defs   = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild);
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', 'sivArrowDb');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '3');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const arrowPath = document.createElementNS(ns, 'path');
    arrowPath.setAttribute('d', 'M0,0.5 L6,3 L0,5.5 Z');
    arrowPath.setAttribute('fill', '#a855f7');
    marker.appendChild(arrowPath);
    defs.appendChild(marker);

    // 破線（本線）
    const dbLine = document.createElementNS(ns, 'path');
    dbLine.setAttribute('d', dxDb);
    dbLine.setAttribute('fill', 'none');
    dbLine.setAttribute('stroke', 'url(#spkGrad)');
    dbLine.setAttribute('stroke-width', '2');
    dbLine.setAttribute('stroke-opacity', '0.85');
    dbLine.setAttribute('stroke-dasharray', '5 4');
    dbLine.setAttribute('stroke-linecap', 'round');
    dbLine.setAttribute('marker-end', 'url(#sivArrowDb)');
    dbLine.classList.add('siv-dyn', 'siv-line');
    svg.appendChild(dbLine);

    // アニメーションドット（下向き）
    const dbDot  = document.createElementNS(ns, 'circle');
    dbDot.setAttribute('r', '3.5');
    dbDot.setAttribute('fill', '#a855f7');
    dbDot.setAttribute('filter', 'url(#siv-glow)');
    dbDot.classList.add('siv-dyn');
    const dbAnim = document.createElementNS(ns, 'animateMotion');
    dbAnim.setAttribute('dur', '1.8s');
    dbAnim.setAttribute('repeatCount', 'indefinite');
    dbAnim.setAttribute('path', dxDb);
    dbDot.appendChild(dbAnim);
    svg.appendChild(dbDot);
  }

  // SIV ラインの描画トリガー
  const sivWrap = document.querySelector('.siv-wrap');
  if (sivWrap) {
    /**
     * wrap の幅が確保されるまで最大 retries 回リトライ
     * @param {number} retries - 残りリトライ回数
     */
    function tryDrawSivLines(retries) {
      const r = sivWrap.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        drawSivLines();
      } else if (retries > 0) {
        setTimeout(() => tryDrawSivLines(retries - 1), 200);
      }
    }

    // 初回：200ms から 200ms 間隔で最大 5 回リトライ
    setTimeout(() => tryDrawSivLines(5), 200);

    // ビューポートに入った時にも再描画（スクロール後対応）
    const sivObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setTimeout(drawSivLines, 100);
    }, { threshold: 0.1 });
    sivObs.observe(sivWrap);

    // リサイズ時にもデバウンスして再描画
    window.addEventListener('resize', () => {
      clearTimeout(window._sivResizeTimer);
      window._sivResizeTimer = setTimeout(drawSivLines, 150);
    }, { passive: true });
  }


  // ===================================================================
  // 13. カーソルグロー（マウスに追従する光の輪）
  // ===================================================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }


  // ===================================================================
  // 14. ヒーロー 3D チルト
  //     マウス位置に応じてダッシュボードをわずかに傾ける
  //     モバイルでは無効化
  // ===================================================================
  const tiltWrap = document.getElementById('hero3dWrap');
  if (tiltWrap) {
    const heroRight = document.querySelector('.hero-right');
    heroRight.addEventListener('mousemove', e => {
      if (isMobile()) return;
      const rect = heroRight.getBoundingClientRect();
      const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)   / rect.height - 0.5;
      tiltWrap.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
    });
    heroRight.addEventListener('mouseleave', () => {
      tiltWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }


  // ===================================================================
  // 15. ヒーロー KPI カウントアップ（ダッシュボードカード）
  //     [data-count] 属性の値に向けてアニメーション
  // ===================================================================

  /**
   * 数値をイージング付きでカウントアップ
   * @param {HTMLElement} el      - 対象要素
   * @param {number}      target  - 目標値
   * @param {number}      decimal - 小数点以下桁数（0なら整数）
   * @param {string}      prefix  - 前置文字列（例: '¥'）
   * @param {string}      suffix  - 後置文字列（例: '件'）
   * @param {number}      duration - アニメーション時間（ms）
   */
  function countUp(el, target, decimal, prefix, suffix, duration) {
    const start = performance.now();
    const update = now => {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // ease-out quartic
      const val  = decimal ? (target * ease).toFixed(decimal) : Math.round(target * ease);
      el.textContent = (prefix || '') + val + (suffix || '');
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // KPI ダッシュボード行がビューポートに入ったらカウントアップ
  const heroKPIObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.hdbk-val[data-count]').forEach(el => {
      countUp(
        el,
        parseFloat(el.dataset.count),
        parseInt(el.dataset.decimal || '0') || 0,
        el.dataset.prefix || '',
        el.dataset.suffix || '',
        1600
      );
    });
    heroKPIObserver.disconnect();
  }, { threshold: 0.4 });

  const kpiRow = document.querySelector('.hdb-kpi-row');
  if (kpiRow) heroKPIObserver.observe(kpiRow);


  // ===================================================================
  // 16. ヒーロー 統計カウントアップ（hero-left の実績数値）
  // ===================================================================
  const statsObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.hstat-num[data-target]').forEach(el => {
      countUp(el, parseInt(el.dataset.target), 0, '', el.dataset.suffix || '', 1800);
    });
    statsObserver.disconnect();
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  // ===================================================================
  // 17. ヒーロー SVG ラインチャート（売上スパークライン）
  //     月次売上データをスムーズ曲線で描画しアニメーション付与
  // ===================================================================
  function buildHeroChart() {
    const el = document.getElementById('heroChart');
    if (!el) return;

    const data = [62, 78, 55, 88, 95, 82, 105, 118, 108, 135, 142, 147]; // 月次売上（単位: M）
    const W    = el.offsetWidth || 260;
    const H    = 70;
    const pad  = 6;
    const max  = Math.max(...data);
    const min  = Math.min(...data);

    // データ点の座標を計算
    const pts = data.map((v, i) => [
      pad + (i / (data.length - 1)) * (W - pad * 2),
      H - pad - ((v - min) / (max - min)) * (H - pad * 2),
    ]);

    // スムーズ曲線パス（中点補間）
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i][0] + pts[i + 1][0]) / 2;
      d += ` C ${cx} ${pts[i][1]} ${cx} ${pts[i + 1][1]} ${pts[i + 1][0]} ${pts[i + 1][1]}`;
    }

    // エリア塗りつぶしパス
    const area = d + ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;

    el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible">
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#EC4C86" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#6152FF" stop-opacity="0.02"/>
          </linearGradient>
          <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#6152FF"/>
            <stop offset="60%"  stop-color="#EC4C86"/>
            <stop offset="100%" stop-color="#0D9488"/>
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="${area}" fill="url(#cg1)"/>
        <path d="${d}" fill="none" stroke="url(#cg2)" stroke-width="2.5"
              filter="url(#glow2)"
              stroke-dasharray="1000" stroke-dashoffset="1000"
              style="animation: drawLine 1.8s 0.5s ease forwards"/>
        ${pts.slice(-3).map(([x, y], i) => `
          <circle cx="${x}" cy="${y}" r="${i === 2 ? 4 : 2.5}" fill="${i === 2 ? '#EC4C86' : 'rgba(236,76,134,0.5)'}">
            ${i === 2 ? '<animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>' : ''}
          </circle>
        `).join('')}
      </svg>
    `;

    // ライン描画アニメーション用キーフレームを動的に挿入
    if (!document.getElementById('heroChartKF')) {
      const st = document.createElement('style');
      st.id = 'heroChartKF';
      st.textContent = '@keyframes drawLine { to { stroke-dashoffset: 0; } }';
      document.head.appendChild(st);
    }
  }

  setTimeout(buildHeroChart, 300);
  window.addEventListener('resize', buildHeroChart);


  // ===================================================================
  // 18. アクティビティフィード サイクル
  //     ライブ風のフィードアイテムを 2.2 秒ごとに巡回ハイライト
  // ===================================================================
  const feedItems = [0, 1, 2]
    .map(n => document.getElementById(`feedItem${n}`))
    .filter(Boolean);

  if (feedItems.length) {
    let fi = 0;
    feedItems[0].classList.add('highlight');
    setInterval(() => {
      feedItems.forEach(el => el.classList.remove('highlight'));
      fi = (fi + 1) % feedItems.length;
      feedItems[fi].classList.add('highlight');
    }, 2200);
  }


  // ===================================================================
  // 19. フローティングカード 入場アニメーション
  //     300ms 刻みでスタガード（段階的）に表示
  // ===================================================================
  ['hfloat1', 'hfloat2', 'hfloat3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px) scale(0.9)';
    el.style.transition = 'all 0.7s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = '';
    }, 900 + i * 300);
  });


  // ===================================================================
  // 20. フィーチャーカード ホバーエフェクト（JS 補完）
  //     CSS トランジションに加え、ボーダー色を動的に変更
  // ===================================================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(236,76,134,0.2)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'rgba(0,0,0,0.06)';
    });
  });


  // ===================================================================
  // 21. フローティングカード アニメーション遅延
  //     CSS animation-delay をカード番号順に設定
  // ===================================================================
  document.querySelectorAll('.float-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 1.5}s`;
  });


  // ===================================================================
  // 22. モバイル ドロップダウン（768px 以下でタップ開閉）
  // ===================================================================
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      const dropdown = link.parentElement.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'grid' ? 'none' : 'grid';
      }
    });
  });


  // ===================================================================
  // 23. KPI セクション スクロールトリガー
  //     .kpi-card が表示領域に入ったら順番に scale(1) でフェードイン
  // ===================================================================
  const kpiSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.kpi-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.transform = 'scale(1)';
          card.style.opacity   = '1';
        }, i * 100);
      });
    });
  }, { threshold: 0.2 });

  const dashMain = document.querySelector('.dash-main');
  if (dashMain) kpiSectionObserver.observe(dashMain);


  // ===================================================================
  // 24. ナビリンク アクティブ状態（クリック時）
  //     クリックされたリンクにのみ .active を付与
  // ===================================================================
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });


  // ===================================================================
  // 初期化完了 — AOS を二段階で発火してアニメーション取りこぼし防止
  // ===================================================================
  window.addEventListener('load', () => {
    setTimeout(revealOnScroll, 200);
    setTimeout(revealOnScroll, 600);
  });

  console.log('🚀 STRUCT HP initialized');

}); // end DOMContentLoaded
