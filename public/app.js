// Application State
let state = {
  storm: 0,
  nonCreature: 0,
  instantSorcery: 0,
  history: []
};

// DOM Elements
const elements = {
  stormVal: document.getElementById('storm-val'),
  nonCreatureVal: document.getElementById('noncreature-val'),
  isVal: document.getElementById('is-val'),
  stormProgress: document.getElementById('storm-progress'),
  
  btnStorm: document.getElementById('btn-storm'),
  btnNonCreature: document.getElementById('btn-noncreature'),
  btnIS: document.getElementById('btn-is'),
  btnReset: document.getElementById('btn-reset'),
  
  historyList: document.getElementById('history-list'),
  historyEmpty: document.getElementById('history-empty'),
  historyCount: document.getElementById('history-count')
};

// Utility to apply CSS bump animation to a element
function triggerBumpAnimation(element) {
  element.classList.remove('value-bump');
  void element.offsetWidth; // Force a DOM reflow to restart animation
  element.classList.add('value-bump');
}

// Update DOM elements based on current state
function updateUI(changedFields = []) {
  // Update counter values
  if (changedFields.includes('storm') || changedFields.length === 0) {
    elements.stormVal.textContent = state.storm;
    triggerBumpAnimation(elements.stormVal);
    
    // Update progress bar width (max 20 spells visually, but can go higher)
    const progressPercent = Math.min((state.storm / 20) * 100, 100);
    elements.stormProgress.style.width = `${progressPercent}%`;
  }
  
  if (changedFields.includes('nonCreature') || changedFields.length === 0) {
    elements.nonCreatureVal.textContent = state.nonCreature;
    triggerBumpAnimation(elements.nonCreatureVal);
  }
  
  if (changedFields.includes('instantSorcery') || changedFields.length === 0) {
    elements.isVal.textContent = state.instantSorcery;
    triggerBumpAnimation(elements.isVal);
  }

  // Update History Display
  updateHistoryUI();
}

// Update the history list in DOM
function updateHistoryUI() {
  elements.historyCount.textContent = `${state.history.length} Spell${state.history.length === 1 ? '' : 's'}`;
  
  if (state.history.length === 0) {
    elements.historyEmpty.style.display = 'block';
    // Remove all history items
    const items = elements.historyList.querySelectorAll('.history-item');
    items.forEach(item => item.remove());
    return;
  }
  
  elements.historyEmpty.style.display = 'none';
  
  // Clear list items first
  const existingItems = elements.historyList.querySelectorAll('.history-item');
  existingItems.forEach(item => item.remove());

  // Render list items in reverse chronological order
  state.history.slice().reverse().forEach(spell => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'history-item-label';
    
    const dot = document.createElement('span');
    dot.className = `dot dot-${spell.type}`;
    
    const text = document.createTextNode(spell.name);
    labelSpan.appendChild(dot);
    labelSpan.appendChild(text);
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'history-item-time';
    timeSpan.textContent = spell.time;
    
    itemDiv.appendChild(labelSpan);
    itemDiv.appendChild(timeSpan);
    
    elements.historyList.appendChild(itemDiv);
  });
}

// Add cast action to history array
function addToHistory(spellName, typeKey) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  state.history.push({
    name: spellName,
    type: typeKey,
    time: timeStr
  });
}

// Event Listeners for Spell Casts
elements.btnStorm.addEventListener('click', () => {
  state.storm += 1;
  addToHistory('Creature Spell', 'creature');
  updateUI(['storm']);
});

elements.btnNonCreature.addEventListener('click', () => {
  state.storm += 1;
  state.nonCreature += 1;
  addToHistory('Non-Creature Spell', 'noncreature');
  updateUI(['storm', 'nonCreature']);
});

elements.btnIS.addEventListener('click', () => {
  state.storm += 1;
  state.nonCreature += 1;
  state.instantSorcery += 1;
  addToHistory('Instant / Sorcery', 'is');
  updateUI(['storm', 'nonCreature', 'instantSorcery']);
});

// Event Listener for Reset
elements.btnReset.addEventListener('click', () => {
  state.storm = 0;
  state.nonCreature = 0;
  state.instantSorcery = 0;
  state.history = [];
  updateUI();
});

// Initial UI load
updateUI();
