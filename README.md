# WEbDle

Extensión de Chrome que convierte cualquier página web en un juego de adivinar palabras: al pulsar su icono aparece un panel flotante a un lado de la página y se elige al azar una palabra de **5 letras** del texto visible. Tienes 6 intentos, y solo valen palabras que aparezcan en la página.

- 🟩 letra correcta en su sitio · 🟨 está en la palabra pero en otro sitio · ⬛ no está
- Las tildes se ignoran (`CANCIÓN` → `CANCION`), la `Ñ` se conserva.
- Al terminar, **Resaltar en la página** marca dónde estaba la palabra.

## Instalar (modo desarrollador)

1. Abre `chrome://extensions`.
2. Activa **Modo de desarrollador** (arriba a la derecha).
3. Pulsa **Cargar descomprimida** y elige esta carpeta (`WEbDle`).
4. Fija el icono en la barra de Chrome (icono del puzle → chincheta).

## Uso

- Clic en el icono → abre el panel (otro clic lo oculta/muestra).
- Escribe con tu teclado (con el panel enfocado; haz clic en él si hace falta). `Enter` envía, `Retroceso` borra, `Esc` oculta.
- Arrastra la cabecera para mover el panel. `↻` empieza otra partida, `–` minimiza.
- Cada pestaña tiene su propia partida. Si la web cambia de página sin recargar (YouTube, Gmail…), la partida se reinicia sola con el texto nuevo.

No funciona en páginas protegidas por Chrome (`chrome://…`, Chrome Web Store, visor de PDF); el icono muestra un `!`.

## Archivos

| Archivo | Función |
|---|---|
| `manifest.json` | Manifest V3, permisos `activeTab` + `scripting` |
| `background.js` | Inyecta `content.js` al pulsar el icono |
| `content.js` | Extrae las palabras, lógica del juego, panel y sus estilos |
| `package.ps1` | Genera `dist/WEbDle-v<versión>.zip` para subir a la Chrome Web Store |
| `CHROMEWEBSTORE.md` | Textos, permisos, privacidad y pasos para publicar en la tienda |
| `PRIVACY.md` | Política de privacidad (hay que publicarla en una URL pública) |
| `store-assets/` | Capturas 1280×800 y mosaico promocional 440×280 |

## Flujo de trabajo (Gitflow)

| Rama | Para qué |
|---|---|
| `main` | Solo versiones publicadas. Cada una lleva su etiqueta (`v1.0.2`, …). |
| `develop` | Integración del trabajo en curso. Las ramas nuevas salen de aquí. |
| `feature/<nombre>` | Una funcionalidad. Sale de `develop` y vuelve a `develop`. |
| `release/<versión>` | Preparar una versión: subir `version` en `manifest.json`, historial en `CHROMEWEBSTORE.md`. Sale de `develop` y se fusiona en `main` (con etiqueta) y en `develop`. |
| `hotfix/<versión>` | Arreglo urgente de lo publicado. Sale de `main` y se fusiona en `main` (con etiqueta) y en `develop`. |
