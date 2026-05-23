/**
 * STRUCT - Scroll-Linked Spin Effect
 * ─────────────────────────────────────────────────────────
 * .js-spin-in 要素について、スクロール量に連動して
 *   - 回転（rotate）
 *   - スケール（scale）
 *   - 奥行き（translateZ）
 *   - 不透明度／ブラー
 * が変化する。スクロールした分だけ手前に飛び出して大きくなり、
 * 所定位置で完全に着地するイメージ。
 *
 * 進捗 p = 0  : 空の彼方（小さく・回転・ぼやけ・透明寄り）
 * 進捗 p = 1  : 所定位置（等倍・正立・くっきり・不透明）
 *
 * 進捗の決め方：
 *   要素の上端がビューポート下端に到達した瞬間 → p=0
 *   要素の中心がビューポート中央に到達した瞬間 → p=1
 *   それ以降は p=1 を維持
 * ─────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // 初期パラメータ（CSSの初期値と整合させる）
  const START = {
    rotate:     -540, // 度
    rotateX:     35,
    rotateY:    -25,
    translateX:-180,
    translateY:-120,
    translateZ:-1400,
    scale:       0.18,
    blur:       10,   // px
    opacity:    0,
  };
  const END = {
    rotate:       0,
    rotateX:      2,
    rotateY:      0,
    translateX:   0,
    translateY:   0,
    translateZ:   0,
    scale:        1,
    blur:         0,
    opacity:      1,
  };

  // easeOutCubic 風の補間（最後の収まりを滑らかに）
  function ease(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 2);
  }

  const lerp = (a, b, t) => a + (b - a) * t;

  function applyProgress(el, p) {
    const eased = ease(p);
    const wrap = el.querySelector('.assign-hl-screenshot-wrap') || el;

    const rotate     = lerp(START.rotate,     END.rotate,     eased);
    const rotateX    = lerp(START.rotateX,    END.rotateX,    eased);
    const rotateY    = lerp(START.rotateY,    END.rotateY,    eased);
    const translateX = lerp(START.translateX, END.translateX, eased);
    const translateY = lerp(START.translateY, END.translateY, eased);
    const translateZ = lerp(START.translateZ, END.translateZ, eased);
    const scale      = lerp(START.scale,      END.scale,      eased);
    const blur       = lerp(START.blur,       END.blur,       eased);
    const opacity    = lerp(START.opacity,    END.opacity,    eased);

    wrap.style.transform =
      'perspective(2400px)' +
      ' translate3d(' + translateX.toFixed(2) + 'px, ' +
                       translateY.toFixed(2) + 'px, ' +
                       translateZ.toFixed(2) + 'px)' +
      ' rotate(' + rotate.toFixed(2) + 'deg)' +
      ' rotateX(' + rotateX.toFixed(2) + 'deg)' +
      ' rotateY(' + rotateY.toFixed(2) + 'deg)' +
      ' scale(' + scale.toFixed(4) + ')';
    wrap.style.opacity = opacity.toFixed(3);
    wrap.style.filter  = blur > 0.05 ? ('blur(' + blur.toFixed(2) + 'px)') : 'none';
  }

  function init() {
    const targets = Array.from(document.querySelectorAll('.js-spin-in'));
    if (!targets.length) return;

    // モーション削減環境は即座に最終状態にして終了
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      targets.forEach(el => {
        el.classList.add('is-visible', 'js-spin-scroll');
        applyProgress(el, 1);
      });
      return;
    }

    // CSS側のトランジションを無効化するためのフラグ用クラスを付与
    targets.forEach(el => {
      el.classList.add('js-spin-scroll');
      // 初期は p=0 を適用（空の彼方）
      applyProgress(el, 0);
    });

    let ticking = false;

    function update() {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      targets.forEach(el => {
        const rect = el.getBoundingClientRect();

        // p=0 になる地点：要素の上端がビューポート下端
        // p=1 になる地点：要素の中心がビューポート中央
        const elCenter = rect.top + rect.height / 2;
        const start = vh;             // 要素top が vh の位置（=画面下端）
        const end   = vh / 2;         // 要素center が画面中央

        // 「要素topがビューポート下端に到達した瞬間」を基準にする
        // 開始: rect.top === vh → p=0
        // 終了: elCenter === vh/2 → p=1
        // 補間値を rect.top で取る（端的で滑らか）
        const target = vh / 2 - rect.height / 2; // p=1 の rect.top
        const denom = start - target;
        let p = (start - rect.top) / denom;
        if (!isFinite(p)) p = 0;
        p = Math.max(0, Math.min(1, p));

        applyProgress(el, p);

        if (p >= 1) {
          el.classList.add('is-visible');
        } else {
          el.classList.remove('is-visible');
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // 初回計算
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
