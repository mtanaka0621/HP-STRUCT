/**
 * STRUCT Lightbox
 * ─────────────────────────────────────────────────────────
 * 対象画像をクリックするとモーダルで拡大表示するライトボックス。
 *
 * 対応セレクター:
 *   - .fnl-img
 *   - .feat-img-shadow img
 *   - .hero-screen-frame img
 *
 * 操作方法:
 *   - 画像クリック  : 開く
 *   - 背景クリック  : 閉じる
 *   - ×ボタン      : 閉じる
 *   - Esc キー      : 閉じる
 * ─────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ───────────────────────────────────────────
  // 定数
  // ───────────────────────────────────────────

  /** ライトボックスを適用する画像セレクター */
  const SELECTORS = [
    '.fnl-img',
    '.feat-img-shadow img',
    '.feat-img-frame img',
    '.hero-screen-frame img',
    '.assign-hl-screenshot-wrap img',
  ].join(', ');

  // ───────────────────────────────────────────
  // DOM 構築
  // ───────────────────────────────────────────

  /**
   * ライトボックスのオーバーレイ DOM を生成してドキュメントに追加する。
   * スタイルも同時にインジェクトする。
   * @returns {HTMLElement} 生成したオーバーレイ要素
   */
  function buildOverlay() {
    // ── オーバーレイ本体 ──
    const ov = document.createElement('div');
    ov.id = 'lbOverlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', '画像を拡大表示');
    ov.innerHTML = `
      <div id="lbInner">
        <button id="lbClose" aria-label="閉じる">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <line x1="18" y1="6"  x2="6"  y2="18"/>
            <line x1="6"  y1="6"  x2="18" y2="18"/>
          </svg>
        </button>
        <div id="lbImgWrap">
          <img id="lbImg" src="" alt="" />
        </div>
        <div id="lbCaption"></div>
      </div>`;

    // ── インラインスタイル ──
    const style = document.createElement('style');
    style.textContent = `
      /* オーバーレイ背景 */
      #lbOverlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(10, 10, 20, 0.82);
        backdrop-filter: blur(6px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 0;
        opacity: 0;
        transition: opacity 0.22s ease;
        cursor: zoom-out;
      }
      #lbOverlay.lb-visible { opacity: 1; }
      #lbOverlay.lb-open    { display: flex; }

      /* 内側コンテナ（スケールアニメーション） */
      #lbInner {
        position: relative;
        width: 85vw !important;
        height: 85vh !important;
        max-width: 85vw !important;
        max-height: 85vh !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: default;
        transform: scale(0.96);
        transition: transform 0.22s ease;
      }
      #lbOverlay.lb-visible #lbInner { transform: scale(1); }

      /* 画像ラッパー */
      #lbImgWrap {
        border-radius: 10px;
        overflow: hidden;
        width: 85vw !important;
        height: 85vh !important;
        max-width: 85vw !important;
        max-height: 85vh !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 24px 60px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.08);
      }

      /* 拡大画像 */
      #lbOverlay #lbImg {
        display: block;
        width: 85vw !important;
        height: 85vh !important;
        max-width: 85vw !important;
        max-height: 85vh !important;
        object-fit: contain;
        cursor: default;
      }

      /* キャプション */
      #lbCaption {
        position: absolute;
        left: 50%;
        bottom: 16px;
        transform: translateX(-50%);
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(0,0,0,0.45);
        font-size: 12px;
        color: rgba(255,255,255,0.85);
        text-align: center;
        max-width: min(600px, 90vw);
        line-height: 1.5;
        pointer-events: none;
      }

      /* 閉じるボタン */
      #lbClose {
        position: fixed;
        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.12);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s, transform 0.15s;
        z-index: 1;
        backdrop-filter: blur(4px);
      }
      #lbClose:hover {
        background: rgba(255,255,255,0.25);
        transform: scale(1.12);
      }

      /* トリガー画像にズームカーソルを付与 */
      .lb-trigger { cursor: zoom-in !important; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(ov);
    return ov;
  }

  // ───────────────────────────────────────────
  // 開閉処理
  // ───────────────────────────────────────────

  /**
   * ライトボックスを開く。
   * @param {HTMLImageElement} img - クリックされたトリガー画像
   */
  function openLightbox(img) {
    const ov    = document.getElementById('lbOverlay') || buildOverlay();
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCaption');

    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';

    ov.classList.add('lb-open');
    // 2フレーム後にフェードイン（display:flex が適用されてから opacity を変更）
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('lb-visible')));
    document.body.style.overflow = 'hidden'; // 背景スクロールを抑止
  }

  /**
   * ライトボックスを閉じる（フェードアウト後に非表示）。
   */
  function closeLightbox() {
    const ov = document.getElementById('lbOverlay');
    if (!ov) return;
    ov.classList.remove('lb-visible');
    ov.addEventListener('transitionend', () => {
      ov.classList.remove('lb-open');
      document.body.style.overflow = '';
    }, { once: true });
  }

  // ───────────────────────────────────────────
  // イベント登録
  // ───────────────────────────────────────────

  /**
   * ライトボックスを初期化する。
   * - オーバーレイを構築
   * - 閉じるイベント（背景クリック・×ボタン・Esc）を登録
   * - 対象画像にクリックイベントを付与
   * - MutationObserver で遅延ロード画像にも対応
   */
  function init() {
    const ov = buildOverlay();

    // 背景クリックで閉じる（内側コンテナのクリックは除外）
    ov.addEventListener('click', e => {
      if (e.target === ov) closeLightbox();
    });

    // ×ボタンで閉じる
    document.getElementById('lbClose').addEventListener('click', closeLightbox);

    // Esc キーで閉じる
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });

    /**
     * 対象セレクターに一致する未バインドの画像にクリックイベントを付与する。
     * data-lb-bound フラグで二重バインドを防止。
     */
    function bindImages() {
      document.querySelectorAll(SELECTORS).forEach(img => {
        if (img.dataset.lbBound) return;
        img.dataset.lbBound = '1';
        img.classList.add('lb-trigger');
        img.addEventListener('click', e => {
          e.stopPropagation();
          openLightbox(img);
        });
      });
    }

    bindImages();

    // 動的に追加された画像（遅延ロード等）にも対応
    const mo = new MutationObserver(bindImages);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // DOMContentLoaded 済みなら即実行、未済なら待機
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
