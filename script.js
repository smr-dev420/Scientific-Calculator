let expression = '';
let mode = 'deg';
let theme = 'dark';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
const exprEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

function updateDisplay() {
  exprEl.textContent = expression || '0';
}
function press(t) {
  expression += t;
  updateDisplay();
}
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}
function clearAll() {
  expression = '';
  resultEl.textContent = '0';
  updateDisplay();
}
function toggleSign() {
  expression = '(' + expression + ')*(-1)';
  updateDisplay();
}
function setMode(m) {
  mode = m;
  document.getElementById('degBtn').classList.toggle('active', m === 'deg');
  document.getElementById('radBtn').classList.toggle('active', m === 'rad');
}
function degToRad(x) {
  return x * Math.PI / 180;
}
function sin(x) {
  return Math.sin(mode === 'deg' ? degToRad(x) : x);
}
function cos(x) {
  return Math.cos(mode === 'deg' ? degToRad(x) : x);
}
function tan(x) {
  return Math.tan(mode === 'deg' ? degToRad(x) : x);
}
function asin(x) {
  return mode === 'deg' ? Math.asin(x) * 180 / Math.PI : Math.asin(x);
}
function acos(x) {
  return mode === 'deg' ? Math.acos(x) * 180 / Math.PI : Math.acos(x);
}
function atan(x) {
  return mode === 'deg' ? Math.atan(x) * 180 / Math.PI : Math.atan(x);
}
function sqrt(x) {
  return Math.sqrt(x);
}
function ln(x) {
  return Math.log(x);
}
function log10(x) {
  return Math.log10(x);
}
function exp(x) {
  return Math.exp(x);
}
function abs(x) {
  return Math.abs(x);
}
function fact(n) {
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function sanitize(expr) {
  expr = expr
    .replace(/\^/g, '**')
    .replace(/pi/g, Math.PI)
    .replace(/e/g, Math.E)
    .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
    .replace(/(\d+(?:\.\d+)?)!/g, 'fact($1)');
  return expr;
}
function calculate() {
  if (!expression) return;
  try {
    const val = new Function('return ' + sanitize(expression))();
    resultEl.textContent = isFinite(val) ? val : 'Error';
    addToHistory(expression + ' = ' + val);
    expression = val.toString();
  } catch {
    resultEl.textContent = 'Error';
  }
}
function toggleTheme() {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('light');
    theme = 'light';
    document.getElementById('themeBtn').textContent = '🌙 Dark';
  } else {
    body.classList.remove('light');
    theme = 'dark';
    document.getElementById('themeBtn').textContent = '☀️ Light';
  }
}
function addToHistory(entry) {
  history.unshift(entry);
  if (history.length > 25) history.pop();
  localStorage.setItem('calcHistory', JSON.stringify(history));
  renderHistory();
}
function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = `<li class="no-history">No history yet</li>`;
  } else {
    historyList.innerHTML = history.map(h => `<li>${h}</li>`).join('');
  }
}
function toggleHistory() {
  historyPanel.classList.add('active');
  renderHistory();
}
function closeHistory() {
  historyPanel.classList.remove('active');
}
function clearHistory() {
  history = [];
  localStorage.removeItem('calcHistory');
  renderHistory();
}
updateDisplay();
renderHistory();
