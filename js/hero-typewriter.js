/* =====================================================
   hero-typewriter.js
   ─ ヒーロータイトル「全てが統合された世界へ。」を
     テキストエディタで1文字ずつ入力されるように表示する
   ───────────────────────────────────────────────────────
   - 3行（.ht-line-1 / .ht-line-2 / .ht-line-3）を順番にタイプ
   - 全文字表示後、バックスペースで1文字ずつ削除し最初から繰り返す
   - 表示位置・大きさは現状維持（CSS 側で min-height を確保）
   - prefers-reduced-motion 環境では即時表示で停止
   ===================================================== */
(function () {
  'use strict';

  function init() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const lines = [
      title.querySelector('.ht-line-1'),
      title.querySelector('.ht-line-2'),
      title.querySelector('.ht-line-3'),
    ].filter(Boolean);
    if (lines.length === 0) return;

    // 元のテキストを退避し、表示用に空にする
    const original = lines.map((el) => el.textContent);

    // モーション削減設定時は即座に元テキストを表示して終了
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    lines.forEach((el) => { el.textContent = ''; });
    title.classList.add('js-typewriter-ready');

    // 各文字の入力間隔（ms）。少し揺らがせて自然なタイピング感に
    const typeDelay   = 90;
    const typeJitter  = 50;
    // 削除（バックスペース）の間隔。入力よりやや速め
    const eraseDelay  = 45;
    const eraseJitter = 25;
    // 行と行の間の小休止
    const linePause   = 280;
    // 全行表示完了後 → 削除開始までの間（5秒間ホールド）
    const holdAfterTyped = 5000;
    // 全削除完了後 → 再入力開始までの間
    const holdAfterErased = 600;
    // 開始までのウェイト（ヒーロー全体のフェードインを少し待つ）
    const startDelay = 250;

    // ---------- 入力（タイプ） ----------
    function typeLine(el, text, onDone) {
      el.classList.add('is-typing');
      let i = 0;
      (function step() {
        if (i >= text.length) {
          el.classList.remove('is-typing');
          onDone();
          return;
        }
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, typeDelay + Math.random() * typeJitter);
      })();
    }

    function typeAll(idx, onDone) {
      if (idx >= lines.length) { onDone(); return; }
      typeLine(lines[idx], original[idx], function () {
        setTimeout(() => typeAll(idx + 1, onDone), linePause);
      });
    }

    // ---------- 削除（バックスペース） ----------
    // 行を逆順で1文字ずつ消していく
    function eraseLine(el, onDone) {
      el.classList.add('is-typing');
      (function step() {
        const cur = el.textContent;
        if (cur.length === 0) {
          el.classList.remove('is-typing');
          onDone();
          return;
        }
        el.textContent = cur.slice(0, -1);
        setTimeout(step, eraseDelay + Math.random() * eraseJitter);
      })();
    }

    function eraseAll(idx, onDone) {
      if (idx < 0) { onDone(); return; }
      // 既に空の行はスキップ
      if (!lines[idx].textContent) {
        eraseAll(idx - 1, onDone);
        return;
      }
      eraseLine(lines[idx], function () {
        setTimeout(() => eraseAll(idx - 1, onDone), Math.max(120, linePause / 2));
      });
    }

    // ---------- ループ制御 ----------
    function cycle() {
      typeAll(0, function () {
        // 全文字表示 → ホールド → バックスペースで全消し
        setTimeout(function () {
          eraseAll(lines.length - 1, function () {
            // 全消し後、少し休んでから再入力
            setTimeout(cycle, holdAfterErased);
          });
        }, holdAfterTyped);
      });
    }

    setTimeout(cycle, startDelay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
