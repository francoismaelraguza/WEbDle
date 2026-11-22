# Ficha de Chrome Web Store — WEbDle

> Última actualización: 2026-11-22

Todo lo que hay que copiar en el panel de desarrollador de la Chrome Web Store. Los campos marcados como **[PENDIENTE]** los tienes que rellenar tú.

## Ficha de la tienda

**Nombre de la extensión**
WEbDle

**Descripción breve** (máx. 132 caracteres; igual que en `manifest.json`)
Juego de adivinar palabras de 5 letras usando una palabra al azar de la página que estás viendo.

**Descripción detallada** (texto plano: la tienda no muestra markdown)

```
WEbDle convierte cualquier página web en un juego de adivinar palabras: elige al azar una palabra de 5 letras del texto que estás leyendo y tienes 6 intentos para descubrirla.

CARACTERÍSTICAS
• Una partida distinta en cada página: la palabra secreta sale del texto visible de la web que tienes abierta.
• Solo valen palabras que aparezcan en la página, así que leer con atención tiene premio.
• Pistas por colores: verde si la letra está en su sitio, amarillo si está en la palabra pero en otra posición, gris si no está.
• Las tildes no cuentan (CANCIÓN cuenta como CANCION) y la Ñ se respeta.
• Al terminar, «Resaltar en la página» te lleva hasta el lugar del texto donde estaba la palabra.
• El panel flota al lado de la página sin cambiar su aspecto. Puedes moverlo, minimizarlo o cerrarlo.
• Cada pestaña tiene su propia partida, y si la web cambia de página sin recargar, empieza una partida nueva con el texto nuevo.

CÓMO SE JUEGA
1. Abre cualquier página con texto (un artículo, una noticia, una receta…).
2. Pulsa el icono de WEbDle en la barra de Chrome.
3. Escribe una palabra de 5 letras con tu teclado y pulsa Enter.
4. Usa los colores para acercarte a la palabra secreta. Tienes 6 intentos.
5. Pulsa ↻ para jugar otra partida con la misma página, o Esc para ocultar el panel.

PRIVACIDAD
WEbDle solo lee el texto de la pestaña en la que pulsas el icono, y solo en ese momento. No guarda ni envía nada: no hay cuentas, ni analíticas, ni conexión a ningún servidor. Todo el juego ocurre en tu ordenador.

PERMISOS
WEbDle no pide acceso a todas tus webs. Solo actúa en la pestaña actual cuando pulsas su icono, para leer el texto y mostrar el panel del juego.

LIMITACIONES
No funciona en páginas protegidas por Chrome (como la configuración del navegador, la propia Chrome Web Store o el visor de PDF). En esas páginas el icono muestra un «!».

SOPORTE
¿Has encontrado un error o tienes una idea? Escribe a [PENDIENTE: correo o URL de soporte].
```

**Categoría**
Estilo de vida → Juegos (Lifestyle → Games)

**Propósito único** (se rellena en la pestaña «Prácticas de privacidad»)
Mostrar, en un panel junto a la página actual, un juego de adivinar una palabra de 5 letras elegida al azar del texto de esa página.

**Idioma principal**
Español

## Gráficos

| Recurso | Tamaño | Estado | Archivo |
|---|---|---|---|
| Icono de la tienda | 128×128 PNG (dibujo de 96×96 con 16 px de margen) | ✅ Listo | `icons/icon128.png` |
| Captura 1: panel recién abierto | 1280×800 | ✅ Listo | `store-assets/screenshot-1-inicio.png` |
| Captura 2: partida a medias | 1280×800 | ✅ Listo | `store-assets/screenshot-2-jugando.png` |
| Captura 3: partida ganada con la palabra resaltada | 1280×800 | ✅ Listo | `store-assets/screenshot-3-ganaste.png` |
| Mosaico promocional pequeño | 440×280 | ✅ Listo | `store-assets/promo-small-440x280.png` |
| Mosaico marquesina | 1400×560 | ⬜ Opcional, no creado | |

Las capturas se hicieron con la versión 1.0.1 sobre una página de demostración propia («Cuaderno de viajes», texto original), así que no aparecen marcas ni logotipos de terceros. Si cambia el aspecto del panel, hay que repetirlas.

## Justificación de permisos

| Permiso | Tipo | Justificación (para el revisor) |
|---|---|---|
| `activeTab` | permissions | Cuando el usuario pulsa el icono de la extensión, WEbDle necesita leer el texto visible de esa pestaña para elegir la palabra secreta y comprobar que los intentos aparecen en la página. `activeTab` da ese acceso solo a la pestaña actual y solo tras el clic; la extensión no accede a ninguna otra pestaña ni actúa en segundo plano. |
| `scripting` | permissions | Se usa para insertar el panel del juego (y sus estilos) en la pestaña actual en el momento en que el usuario pulsa el icono. No se inyecta nada de forma automática en ninguna página. |

No hay `host_permissions` ni scripts de contenido declarados en el manifiesto. Al instalarla, Chrome no muestra ninguna advertencia de permisos.

**¿Usa código remoto?** No. Todo el JavaScript está incluido en el paquete.

## Privacidad y uso de datos

### Recopilación de datos

**¿La extensión recopila datos de usuario?** No.

| Tipo de dato | ¿Se recopila? | ¿Sale del dispositivo? | Notas |
|---|---|---|---|
| Información personal identificable | No | No | |
| Información de salud | No | No | |
| Información financiera | No | No | |
| Información de autenticación | No | No | |
| Comunicaciones personales | No | No | |
| Ubicación | No | No | |
| Historial web | No | No | |
| Actividad del usuario | No | No | |
| Contenido de sitios web | No | No | El texto visible de la pestaña se lee en el propio navegador, solo tras el clic del usuario, para el juego. No se guarda ni se envía a ningún sitio. |

En el formulario no marques ninguna casilla de tipos de datos, porque ninguno sale del dispositivo ni se guarda.

### Certificaciones (marcar las tres)
- [x] Los datos no se venden a terceros
- [x] Los datos no se usan para fines ajenos a la función principal
- [x] Los datos no se usan para evaluar solvencia ni para préstamos

## Política de privacidad

**URL de la política de privacidad**: **[PENDIENTE]**

El texto está en [`PRIVACY.md`](PRIVACY.md). Rellena tu correo de contacto y publícalo en una URL pública y estable (por ejemplo, un Gist público de GitHub, GitHub Pages o una página de Google Sites). Abre el enlace antes de enviar la extensión: si da error 404, la rechazan automáticamente.

## Distribución

**Visibilidad**: Pública
**Regiones**: Todas

## Datos del desarrollador

**Nombre del editor**: **[PENDIENTE]**
**Correo de contacto** (se muestra en la ficha; tiene que estar verificado y lo debes revisar): **[PENDIENTE]**
**URL o correo de soporte**: **[PENDIENTE]**
**Página principal**: opcional

## Historial de versiones

| Versión | Fecha | Cambios | Estado |
|---|---|---|---|
| 1.0.2 | 2026-11-22 | En webs que cambian de página sin recargar (YouTube, Gmail, Docker Hub…), la partida se reinicia sola con las palabras del contenido nuevo y avisa con un mensaje. Los saltos a una sección (#) y los cambios de URL que no cambian el texto no reinician. | Borrador |
| 1.0.1 | 2026-11-22 | Corregido: el panel podía aparecer sin estilos (botones sueltos y sin cuadrícula). Ahora los estilos van dentro del propio panel y funcionan también en webs con políticas de seguridad estrictas. | Borrador |
| 1.0.0 | 2026-11-18 | Primera versión: juego de 5 letras con palabras de la página actual, panel flotante movible, validación contra el texto de la página y opción de resaltar la palabra. | Borrador |

## Notas de revisión

### Problemas conocidos / limitaciones
- No se puede usar en `chrome://`, en la Chrome Web Store ni en el visor de PDF (Chrome lo bloquea). La extensión muestra un «!» en el icono en vez de fallar.
- Las páginas con muy poco texto pueden no tener ninguna palabra de 5 letras; el panel lo avisa.
- Solo se lee el texto visible de la página principal, no el de los iframes (como anuncios o vídeos incrustados).

### Historial de rechazos
Ninguno todavía.

## Cómo publicar

1. Genera el paquete con `powershell -ExecutionPolicy Bypass -File package.ps1`. Crea `dist/WEbDle-v<versión>.zip` solo con los archivos que necesita la extensión.
2. Entra en el panel de desarrollador de la Chrome Web Store. La primera vez se paga una cuota de registro única.
3. Pulsa **Nuevo elemento** y sube el ZIP.
4. Copia los textos de este documento en las pestañas **Ficha de la tienda** y **Prácticas de privacidad**, y sube las imágenes de `store-assets/` y el icono.
5. Envía la extensión a revisión. La primera revisión suele tardar entre 1 y 3 días hábiles.
6. Para cada actualización, sube `version` en `manifest.json` y añade una fila al historial de versiones.
