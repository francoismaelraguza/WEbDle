// Al pulsar el icono, inyecta (o alterna) el panel del juego en la pestaña activa.
// content.js lleva todo lo necesario (lógica y estilos), así que no depende de este archivo.
async function playInTab(tab) {
  if (!tab.id) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    await chrome.action.setBadgeText({ tabId: tab.id, text: '' });
    await chrome.action.setTitle({ tabId: tab.id, title: 'Jugar a WEbDle con esta página' });
  } catch (err) {
    // Páginas como chrome://, la Chrome Web Store o el visor de PDF no permiten inyectar scripts.
    console.warn('WEbDle: no se puede jugar en esta página.', err);
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#c0392b' });
    await chrome.action.setBadgeText({ tabId: tab.id, text: '!' });
    await chrome.action.setTitle({ tabId: tab.id, title: 'WEbDle no puede ejecutarse en esta página' });
  }
}

chrome.action.onClicked.addListener(playInTab);
