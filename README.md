# Bitácora

**En línea: <https://caronapetit-spec.github.io/bitacora/>**

App personal para el iPhone: **hábitos, tareas/compra, gastos, notas y gimnasio** en una
sola pantalla. Es una **PWA** (Progressive Web App): una web que se instala en la pantalla
de inicio y se comporta como una app nativa — icono propio, pantalla completa, sin barra
de navegador, y funciona sin internet.

Se eligió PWA porque es lo único que se puede construir **entero desde Windows**: para
una app nativa de iOS hace falta un Mac con Xcode para compilar, y una cuenta de Apple
Developer (99 USD/año) para poder instalarla en un dispositivo.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa: estructura, estilos y lógica en un solo archivo. Es lo único que hay que editar para cambiar la app. |
| `manifest.webmanifest` | Le dice al teléfono cómo se llama la app, su icono y que abra a pantalla completa. |
| `sw.js` | El *service worker*: guarda la app en el teléfono para que abra sin internet. |
| `assets/icon-*.png` | El icono, en los tamaños que pide cada sistema. |

No hay dependencias ni paso de compilación. No hace falta instalar nada.

## Probarla en el ordenador

Un doble clic en `index.html` funciona, pero el service worker no se activa con `file://`.
Para verla igual que en el teléfono, levanta un servidor local (necesitas Python, que ya
tienes instalado):

```bash
cd "C:/Users/Usuario/Desktop/Proyectos/Bitacora" && python -m http.server 8080
```

Y abre <http://localhost:8080>. Para parar el servidor, Ctrl+C.

## Publicarla para instalarla en el iPhone

Safari solo instala PWAs servidas por **HTTPS**, así que hay que subirla a algún sitio.
GitHub Pages es gratis y no caduca.

### 1. Subir la carpeta a GitHub

```bash
cd "C:/Users/Usuario/Desktop/Proyectos/Bitacora" && git init && git add . && git commit -m "Primera version de Bitacora"
```

Crea un repositorio vacío en <https://github.com/new> (por ejemplo `bitacora`), **sin**
README ni `.gitignore`, y conéctalo:

```bash
cd "C:/Users/Usuario/Desktop/Proyectos/Bitacora" && git remote add origin https://github.com/caronapetit-spec/bitacora.git && git branch -M main && git push -u origin main
```

### 2. Activar GitHub Pages

En el repositorio: **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama
`main`, carpeta `/ (root)`, y **Save**. En un par de minutos la app estará en:

```
https://caronapetit-spec.github.io/bitacora/
```

### 3. Instalarla en el teléfono

1. Abre esa dirección en el iPhone **con Safari** (Chrome en iOS no puede instalar PWAs).
2. Toca **Compartir** (el cuadrado con la flecha hacia arriba).
3. Baja y elige **Añadir a pantalla de inicio**.
4. Confirma. Aparece el icono junto a las demás apps.

Al abrirla desde ese icono no se ve nada del navegador: es la app a pantalla completa.

### Publicar un cambio

Cada vez que edites `index.html`:

1. Sube el número de versión en `sw.js` (`bitacora-v1` → `bitacora-v2`). Si no lo haces,
   el teléfono puede seguir sirviendo la versión vieja desde la caché.
2. ```bash
   cd "C:/Users/Usuario/Desktop/Proyectos/Bitacora" && git add . && git commit -m "Describe el cambio" && git push
   ```

## Dónde se guardan los datos

En el **almacenamiento local del propio teléfono** (`localStorage`), bajo la clave
`bitacora.v1`. Consecuencias importantes:

- Nadie más puede verlos. No hay servidor, no hay cuenta, no hay nube.
- **No se sincronizan** entre dispositivos: lo del iPhone no aparece en el ordenador.
- Si borras los datos de Safari o desinstalas la app, **se pierden**.

Por eso Ajustes (el engranaje arriba a la izquierda) tiene **Copia de seguridad**: copia
ese bloque de texto de vez en cuando y guárdalo en un correo o en tus notas. Pegarlo ahí
mismo y pulsar *Restaurar* devuelve todo. Es también la forma de pasar los datos de un
dispositivo a otro.

## El módulo de gimnasio

Tiene tres secciones dentro de su pestaña:

- **Sesión** — entreno libre o arrancado desde una rutina. Las series se muestran como
  una **tabla editable**: `#`, peso, reps, tipo (`C` calentamiento / `T` trabajo),
  cronómetro y quitar. Se escribe directamente en la casilla, sin abrir ningún panel.
  El botón del cronómetro marca la serie como hecha y arranca **el descanso que le
  corresponde a su tipo**; tocarlo otra vez la desmarca y para el descanso. Al venir de
  una rutina, el peso llega ya puesto y las reps quedan vacías con el objetivo de pista.
  Incluye cronómetro de la sesión, notas del entreno e historial.
- **Rutinas** — cada ejercicio guarda **su lista de series, una a una**: cada serie tiene
  sus propias reps (un número o un intervalo, `6-8`), sus kilos y si es de calentamiento.
  Eso permite escribir progresiones reales dentro del ejercicio — `10×35 cal`, `8×50 cal`,
  `6-8×70`, `6-8×70`, `6-8×72,5`, `6×75` — en vez de un único "4 series de 8".
  El descanso se fija por ejercicio y **por tipo**: uno tras las series de calentamiento
  y otro, normalmente más largo, tras las de trabajo. Al empezar un entreno con la rutina, las series
  aparecen ya puestas en pantalla como huecos que se tocan para registrar.
- **Progreso** — entrenamientos, racha de semanas seguidas, volumen total y ejercicios
  distintos; objetivos con barra de avance; récords personales; evolución del peso de
  cualquier ejercicio; peso corporal con IMC; y logros por niveles.

El modelo de datos es **deliberadamente igual al de FitPals** (`../RegistroFuerza`) —
mismos campos `exercises`/`sets`/`routines`/`goals` y mismos umbrales de logros — para
que los datos se puedan mover de una a otra si algún día hace falta.

### El aviso de fin de descanso

Está montado en tres capas, y conviene entender por qué son tres.

**1 · Alarma sonora — la fiable.** No usa un temporizador de JavaScript, porque iOS
congela el JavaScript de una web en cuanto bloqueas la pantalla o cambias de app. En su
lugar, al empezar el descanso se programan los pitidos **dentro del grafo de Web Audio**,
en un instante absoluto del reloj de audio. De eso se encarga el hilo de audio del
sistema, que sigue corriendo. Para que iOS no cierre la sesión de audio durante la
espera, se reproduce en bucle un ruido a volumen inaudible (`startKeepAlive`), que se
apaga al terminar.

Consecuencia útil: **el modo No molestar y los modos de concentración no la silencian**,
porque para el sistema esto es reproducción de audio, no una notificación. Lo único que
la calla es el interruptor de silencio o el volumen a cero.

**2 · Notificación local.** Se muestra si la app sigue viva en segundo plano. Barata de
añadir, pero no se puede confiar en ella: si iOS ha descargado la pestaña, no llega.

**3 · Push desde tu servidor.** La única forma de que te avise con la app **cerrada del
todo**. Al empezar el descanso, la app llama a `/api/push/schedule-rest` de tu backend de
FitPals, y ese servidor empuja la notificación cuando toca; el `sw.js` de aquí la recibe
y la muestra. Se activa en Ajustes → Avisos, y necesita tres cosas:

- la app servida por **HTTPS** (no funciona en la copia local ni publicada como artifact),
- la app **añadida a la pantalla de inicio** — iOS no da push a webs sin instalar,
- tu servidor de FitPals en marcha.

No se te pide la contraseña: se pega el **token** que FitPals ya guarda tras iniciar
sesión. Solo se almacena ese token.

Aviso de un obstáculo real: el backend de FitPals **no tiene CORS configurado**, porque
sirve su propio frontend desde el mismo origen. Si Bitácora vive en GitHub Pages y el
backend en Render, son dominios distintos y el navegador bloqueará las peticiones hasta
que añadas `CORSMiddleware` en `backend/main.py`. La alternativa sin tocar nada es servir
Bitácora **desde el propio backend** de FitPals: mismo origen, y el problema desaparece.

### Lo que ninguna app puede hacer

Saltarse No molestar **en las notificaciones** no es posible. Eso son las «alertas
críticas» de Apple (`UNNotificationInterruptionLevel.critical`), que exigen un permiso
especial que Apple concede solo a apps nativas revisadas de salud o emergencias. Una web
no puede pedirlo, y una app nativa tampoco lo obtiene sin justificarlo.

La vía legítima es del lado del usuario, y es una sola vez: **Ajustes → Concentración →
tu modo → Apps → añadir Bitácora**. A partir de ahí sus notificaciones atraviesan ese
modo. Y para el caso concreto del gimnasio, la alarma sonora ya resuelve el problema sin
depender de nada de esto.

### Lo que no está, y por qué

**Amigos y comparar progreso.** Requiere cuentas y una base de datos compartida, o sea un
servidor. Si algún día lo quieres aquí, el camino es conectar esta app al backend que ya
tienes en `../RegistroFuerza` en vez de a `localStorage`.
