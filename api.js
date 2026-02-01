/**
 * HARMONY GLASS API SERVICE
 * Conecta el Frontend de GitHub con el Backend de Google Sheets.
 */

// 1. REEMPLAZA ESTA URL con la que te dio Google Apps Script al publicar como "Aplicación Web"
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyGgdvbLIOXA6mp7-ewTb9BwXgMJa6fbDZ5s6xKej2ut9_LpldI1foeoo5KcTtPzVBI/exec";

export const gasApi = {
  async call(action, payload = {}) {
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("TU_URL")) {
      console.warn("API Harmony: Modo local activo. Configure GAS_WEB_APP_URL para persistencia en Google Sheets.");
      return { success: false, error: "URL no configurada" };
    }

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, ...payload })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`API Harmony [${action}]:`, result);
      return result;
    } catch (error) {
      console.error(`API Error en ${action}:`, error);
      return { success: false, error: "Error de conexión con el servidor" };
    }
  }
};
