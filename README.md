# Bitácora

**En línea: <https://caronapetit-spec.github.io/bitacora/>**

App personal para el iPhone: una portada con **lo de hoy**, y detrás **hábitos, listas,
gastos, notas, gimnasio y cultura**. Es una **PWA** (Progressive Web App): una web que se instala en la pantalla
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

Edita `index.html` y lanza:

```bash
cd "C:/Users/Usuario/Desktop/Proyectos/Bitacora" && ./publicar.sh "describe el cambio"
```

El script sube el número de versión **en los tres sitios a la vez** y hace el push. Esos
tres sitios tienen que ir sincronizados o el teléfono se queda con la versión vieja sin
avisar:

| Dónde | Qué hace |
|---|---|
| `index.html` → `BUILD` | lo que la app cree que es |
| `version.json` → `build` | lo que hay publicado, para poder compararlo |
| `sw.js` → `CACHE` | invalida la caché guardada en el teléfono |

### Cómo llega la actualización al teléfono

Una PWA instalada en iOS **no tiene botón de recargar ni "deslizar para actualizar"**, así
que sin ayuda se queda clavada en la versión con la que la instalaste. Por eso la app
compara su `BUILD` con el `version.json` publicado **al abrirse y cada vez que vuelve a
primer plano**. Si hay algo nuevo, avisa y se recarga sola; si tienes un panel abierto,
espera a que lo cierres para no cortarte a media serie.

En **Ajustes → Versión** se ve la que tienes instalada y hay un botón para forzar la
comprobación.

## La portada: "Hoy"

Primera pestaña. Responde *¿qué tengo hoy?* sin entrar en las otras seis: los hábitos que
faltan (marcables desde ahí), lo pendiente, qué rutina te toca y cuánto llevas sin hacerla,
lo gastado hoy y lo que queda de presupuesto, qué estás leyendo o viendo, y los
recordatorios que quedan por saltar.

## Hábitos: cantidad y objetivo semanal

Un hábito puede ser de tres formas:

- **Hecho o no, a diario** — racha en días, como siempre.
- **Hecho o no, con objetivo semanal** — la racha se cuenta **en semanas**. El gimnasio
  está puesto a 5 días por semana: la racha se rompe cuando una semana **acaba** por
  debajo de 5, no por descansar un martes. La semana en curso no la rompe hasta que
  termina, así que ir 3 de 5 un miércoles no te penaliza.
- **Con cantidad** — apuntas un número (1,5 L de agua) y se compara con el objetivo del
  día. La fila ensena el avance y el día solo cuenta si llegas.

Esto arregla algo que medía mal: antes el hábito "Gimnasio" salía **sin racha** por no ir
a diario, castigando un plan de 5 días cumplido a la perfección.

## Gastos: presupuesto y gastos fijos

**Tope mensual** y, si quieres, tope por categoría. El panel dice lo que queda y a qué
ritmo diario puedes gastar para no pasarte; la barra se pone en rojo al pasar, y las
categorías con tope muestran `gastado / tope`.

**Gastos fijos** (alquiler, luz, suscripciones, cuota del gimnasio) se apuntan **solos** el
día del mes que les toca y aparecen marcados como *fijo*. Se marcan con el id del fijo que
los generó, así que no se duplican por abrir la app cinco veces el mismo día. El día se
limita al 28 para que exista en todos los meses.

## Cultura: pendientes y episodios

Tres estados por ficha, y los definen los campos que faltan: sin fecha de inicio está
**pendiente**; con fecha de fin, **terminado**. Así puedes apuntar lo que quieres leer o
ver más adelante, y pasarlo a en curso con un toque.

Las **series** marcan por dónde vas con temporada y episodio (`T2 E5`), igual que los
libros marcan la página.

## Gimnasio: cuánto llevas sin cada rutina

Cada rutina dice cuándo la hiciste por última vez, y la más atrasada lleva la marca
**te toca**. Aparece también en la portada, con un botón para empezarla directamente.

## Recordatorios

Hora, texto y días de la semana. **Hasta dónde llegan, sin adornos:** con la app abierta o
en segundo plano el aviso salta a su hora (suena, vibra y notifica). Con la app **cerrada
del todo**, iOS no permite que una web avise; al volver a abrirla te cuenta lo que se te
haya pasado hoy. Para que suene con la app cerrada hace falta push desde un servidor, lo
mismo que el aviso de fin de descanso.

## Sincronizar entre el móvil y el ordenador

Por defecto **no hay sincronización**: cada dispositivo guarda lo suyo. Si quieres que el
móvil y el ordenador vayan a la vez, se enciende en **Ajustes → Sincronización**, y los
datos pasan a guardarse también en **tu propio servidor** (el backend de FitPals).

### Cómo funciona

El servidor no entiende los datos: guarda el JSON entero y un número de **revisión** que
sube en cada escritura. Cada dispositivo recuerda con qué revisión se sincronizó por
última vez y con qué sello de cambio. De ahí salen los tres únicos casos:

| Situación | Qué hace |
|---|---|
| El servidor sigue donde lo dejé y yo tengo cambios | sube |
| El servidor avanzó y yo no he tocado nada | baja |
| Los dos hemos cambiado | **pregunta**, no pisa nada |

Sube sola a los pocos segundos de cualquier cambio y al dejar la app en segundo plano;
baja al abrirla y al volver a primer plano.

**No hay mezcla automática de las dos versiones.** Ante un choque te enseña las dos fechas
y eliges cuál conservar, con la opción de descargarte antes una copia de la que vas a
descartar. Para un uso normal — el móvil en el gimnasio, el ordenador en casa — esa
pantalla no debería salir casi nunca.

**El token no se sube nunca.** `estadoSinSecretos()` deja el token y la dirección del
servidor fuera tanto del bloque que se sincroniza como de la copia de seguridad — que es un
archivo que puedes acabar mandándote por correo. Al restaurar, `conservarLocal()` mantiene
los del dispositivo.

### Qué hace falta en el servidor

El backend de FitPals (`../RegistroFuerza`) ya trae los endpoints:

- `GET /api/bitacora/meta` — pregunta barata: ¿hay algo nuevo?
- `GET /api/bitacora` — lee el estado completo
- `PUT /api/bitacora` — lo escribe; responde **409** si el otro dispositivo escribió
  entremedias, que es lo que dispara la pantalla de choque

Y la variable de entorno **`CORS_ORIGINS`** con los dominios permitidos, separados por
comas. Sin ella el navegador bloquea las peticiones, porque la app vive en un dominio
distinto del servidor. Por defecto ya admite `https://caronapetit-spec.github.io`.

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

## La lista de cultura

Cuatro categorías — **libros, juegos, películas y series** — con la misma mecánica en
todas: añades lo que has empezado, y cuando lo acabas lo marcas como terminado y le pones
nota del 1 al 10.

Cada ficha guarda **qué** y **cuándo**: fecha de inicio, fecha de fin y cuánto tardaste.
Los terminados se agrupan por año, y cada categoría muestra su nota media. La cabecera
lleva la cuenta de lo terminado en el año en curso.

Los **libros** llevan además **punto de libro**: página actual y total de páginas, con el
porcentaje leído y una barra de progreso en la propia lista, sin tener que abrir la ficha.
Al marcar un libro como terminado, la página salta al total automáticamente.

Cada categoría adapta su vocabulario: un libro tiene *autor* y estás *leyendo*; un juego
tiene *estudio* y estás *jugando*; una película tiene *director* y una serie, *creador*.

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
  Cada ejercicio lleva además su **material**: barra, mancuernas, cable, máquina o peso
  corporal. Se deduce solo del nombre para los 100 ejercicios del catálogo — la misma
  tabla que usa FitPals, para que las dos apps coincidan — y se puede cambiar a mano.
  Tocando el nombre de un ejercicio se **cambia por otro conservando sus series**, que es
  lo habitual: cambias el movimiento, no el esquema de repeticiones.
  El descanso se fija por ejercicio y **por tipo**: uno tras las series de calentamiento
  y otro, normalmente más largo, tras las de trabajo. Al empezar un entreno con la rutina, las series
  aparecen ya puestas en pantalla como huecos que se tocan para registrar.
### Sobrecarga progresiva

Progresión doble, automática. Mientras no llegues al tope del intervalo repites peso; en
cuanto lo clavas, subes. Al registrar una serie **de trabajo** con las reps del tope de su
intervalo, la app sube el peso (2,5 kg por defecto) en **las series que queden por hacer**
y lo deja escrito en **la rutina**, para que el próximo entreno arranque con el peso nuevo.

Ejemplo, con `Press banca` a `6-8`:

```
antes    35c 35c  70  70  72,5  75
haces la 3.ª serie a 70 × 8  ← tope del intervalo
sesión   35c 35c  70  72,5  75  77,5     (la que acabas de hacer no cambia)
rutina   35c 35c  72,5 72,5  75  77,5    (la rampa se conserva)
```

Y si clavas el tope otra vez en la serie siguiente, **vuelve a subir**. No hay límite por
sesión: conseguirlo varias veces seguidas significa que el peso de partida estaba corto, y
la rutina debe reflejarlo entero, no a plazos. El aviso va contando el acumulado del día.

Tres decisiones que conviene conocer:

- **Cada subida se anota en la serie que la provocó**, así que desmarcarla la deshace. Un
  toque accidental no te cambia la rutina para siempre. Queda además un distintivo con el
  acumulado (`+7,5 kg`) junto al nombre del ejercicio.
- **El calentamiento no se toca**: ni lo dispara ni sube con el resto.
- **Los ejercicios a peso corporal no suben solos.** Pasar de 0 a 2,5 kg significa ponerse
  cinturón de lastre, y esa es una decisión tuya, no de la app.

El incremento se cambia en **Progreso → Cuerpo → Altura y edad**: 2,5 kg va bien en barra,
pero quizá quieras 2 en mancuernas o 5 en prensa.

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
