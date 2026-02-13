const toPlainText = (html = '') => {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ');
  }
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

const canUseAsyncClipboard = () =>
  typeof navigator !== 'undefined' &&
  typeof window !== 'undefined' &&
  navigator.clipboard &&
  typeof navigator.clipboard.write === 'function' &&
  typeof window.ClipboardItem !== 'undefined';

const copyWithClipboardItem = async (html) => {
  if (!canUseAsyncClipboard()) return false;
  try {
    const plainText = toPlainText(html);
    const clipboardItem = new window.ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
    });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    return false;
  }
};

const copyWithExecCommand = (html) => {
  if (typeof document === 'undefined') return false;
  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.pointerEvents = 'none';
  hiddenContainer.style.opacity = '0';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.style.top = '0';
  hiddenContainer.innerHTML = html;
  document.body.appendChild(hiddenContainer);
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(hiddenContainer);
  selection.removeAllRanges();
  selection.addRange(range);
  const success = document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(hiddenContainer);
  return success;
};

export const copyHtmlToClipboard = async (html = '') => {
  if (!html) return false;
  if (await copyWithClipboardItem(html)) {
    return true;
  }
  return copyWithExecCommand(html);
};
