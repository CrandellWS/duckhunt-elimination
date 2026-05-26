/**
 * EliminationUI
 *
 * Owns the DOM overlays that make Elimination Mode work:
 *   - side panel showing survivor count + eliminated list
 *   - per-shot reveal text ("BOB ELIMINATED") that fades after ~1.6s
 *   - victory screen ("ALICE WINS!") with restart buttons
 *
 * The game (Game.js) owns the truth about who is alive/eliminated.
 * EliminationUI is a passive renderer — Game pushes updates here.
 */

const REVEAL_FADE_MS = 1600;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

class EliminationUI {
  constructor() {
    this.panel = document.getElementById('elimination-panel');
    this.countEl = document.getElementById('survivors-count');
    this.listEl = document.getElementById('eliminated-list');
    this.victoryScreen = document.getElementById('victory-screen');
    this.winnerNameEl = document.getElementById('winner-name');
    this.eliminatedOrder = [];
  }

  /**
   * Initial render — call once after Game knows the full roster.
   * @param {Number} total - total number of names in the pool
   */
  init(total) {
    this.total = total;
    this.eliminatedOrder = [];
    this.updateSurvivors(total);
    if (this.listEl) this.listEl.innerHTML = '';
    if (this.victoryScreen) this.victoryScreen.style.display = 'none';
  }

  updateSurvivors(remaining) {
    if (!this.countEl) return;
    this.countEl.textContent = `${remaining} of ${this.total} remaining`;
  }

  /**
   * Mark a name eliminated. Updates the side list and fires the reveal overlay.
   * @param {String} name
   * @param {{x:Number,y:Number}} screenPos - where on the SCREEN (not the stage) to anchor the reveal text
   * @param {Number} remaining - survivors left after this elimination
   */
  eliminate(name, screenPos, remaining) {
    this.eliminatedOrder.push(name);
    if (this.listEl) {
      const li = document.createElement('li');
      const order = this.eliminatedOrder.length;
      li.innerHTML = `<span class="order">#${order}</span>${escapeHtml(name)}`;
      this.listEl.appendChild(li);
    }
    this.updateSurvivors(remaining);
    this.showReveal(name, screenPos);
  }

  showReveal(name, screenPos) {
    const el = document.createElement('div');
    el.className = 'reveal-text';
    el.textContent = `${name.toUpperCase()} ELIMINATED`;
    el.style.left = `${screenPos.x}px`;
    el.style.top = `${screenPos.y}px`;
    document.body.appendChild(el);

    // trigger the fade on the next frame so the transition runs
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('fade');
      });
    });

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, REVEAL_FADE_MS + 200);
  }

  /**
   * Show the big victory screen for the last surviving name.
   */
  showVictory(name) {
    if (!this.victoryScreen || !this.winnerNameEl) return;
    this.winnerNameEl.textContent = name;
    this.victoryScreen.style.display = 'flex';
  }

  hide() {
    if (this.panel) this.panel.style.display = 'none';
  }
}

export default EliminationUI;
