# Bitácora

**En línea: <https://caronapetit-spec.github.io/bitacora/>**

App personal para el iPhone: una portada con **lo de hoy**, y detrás **hábitos, listas e
inventario, gastos, notas, gimnasio, cultura y un pomodoro**. Es una **PWA** (Progressive Web App): una web que se instala en la pantalla
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

## Diario, nivel y revisión semanal

### Cómo estás

En la portada, tres toques al día: **ánimo** y **energía** del 1 al 5, y **horas de sueño**.
Tocar otra vez un número lo desmarca.

Debajo, **una línea sobre el día**. Se guarda al salir de la casilla. En la revisión semanal
salen las líneas de esa semana junto al ánimo, y *Todo el diario* las junta por meses: los
números dicen que un día fue un 2; la línea dice por qué.

### Experiencia y niveles

| Acción | XP |
|---|---|
| Hábito cumplido (por día) | 10 |
| Entrenamiento | 50 |
| Sesión de cardio | 30 |
| Bloque de foco | 20 |
| Libro, peli, serie o juego terminado | 40 |
| Día apuntado en el diario | 5 |
| Tarea hecha | 5 |

Cada nivel cuesta más: 50, 200, 450, 800… (`50 × (n−1)²`), con un título cada tres.

**La XP no se guarda: se calcula entera desde tus datos** cada vez. Así no se descuadra
nunca, y todo lo que habías hecho antes de que existiera cuenta desde el primer día.

### Revisión semanal

Desde la portada (y destacada los domingos). Entrenos, horas de foco, gasto y XP ganada,
cada uno **comparado con la semana anterior**; barras de ánimo y sueño día a día; hábitos
cumplidos frente a su meta; ingresos, gastos y dónde se fue más; volumen levantado; y lo
terminado. Se puede navegar hacia semanas anteriores.

### Lo que dicen tus datos

La revisión cruza módulos que nunca se hablaban:

- el sueño de las noches **después** de entrenar, frente a las de descanso;
- el ánimo los días que entrenas;
- la energía cuando duermes 7 horas o más;
- el ánimo los días que cumples todos tus hábitos diarios;
- el gasto en ocio y compras con el ánimo bajo;
- los minutos de foco tras dormir bien.

Mira los últimos 60 días y cada hallazgo **exige al menos 4 días en cada grupo** y una
diferencia apreciable; si no, dice que faltan datos en vez de inventar. Y habla de
*cuando*, nunca de *porque*: son coincidencias, no causas.

Para que el foco entre en esto, el pomodoro guarda ahora un **histórico por día**; antes
solo sabía lo de hoy.

## Objetivos del año

Desde la portada: *leer 12 libros*, *180 entrenos*, *300 km de cardio*, *3.000 € de ahorro*,
*200 días de un hábito* u *horas de foco*. **No se apunta nada dos veces**: cada objetivo solo
guarda el tipo, la cifra y el año, y el progreso se lee de Cultura, Gimnasio, Gastos,
Hábitos o Pomodoro.

La barra lleva una **marca vertical** con donde deberías ir a estas alturas del año para
llegar justo, y debajo si vas por delante o por detrás y a qué cifra llegas si sigues igual.
Los de años anteriores quedan en la hoja con el resultado final.

## Fechas importantes

Cumpleaños y otras fechas con día y mes; el año es opcional y sirve para decir cuántos
cumple o cuántos años hace. Salen en *Hoy* dos semanas antes (arriba del todo si faltan tres
días o menos), y al abrir la app el día antes y el mismo día hay un aviso, una vez al día.
El 29 de febrero se celebra el 28 los años que no son bisiestos.

## Hábitos para dejar

Al crear un hábito eliges **Hacerlo** o **Dejarlo**. Los de dejar van al revés: solo apuntas
el día que caes (*he caído*), y la racha cuenta los días **sin** hacerlo desde la última
caída o desde la fecha en que dices que empezaste. Cada día limpio cuenta como cumplido, así
que suma XP, entra en el mapa de calor y en la revisión semanal. En su ficha: mejor racha,
días limpios, caídas y la opción de apuntar una caída de otro día.

Cambiar un hábito de modo borra sus días apuntados, porque pasarían a significar lo contrario.

## Tareas: prioridad y pasos

Cada tarea tiene prioridad **alta, media o baja** (se elige al añadirla o en su ficha) y la
lista se ordena sola; las de siempre pasaron a *media*. Tocando una tarea se abre su ficha
con **pasos**, cada uno con su casilla y una barra de avance. Al marcar el último, la tarea se
completa sola; si desmarcas uno o añades otro, se reabre.

## Gimnasio: la última vez y cardio

**La última vez.** En la sesión, encima de las series de cada ejercicio, sale lo que hiciste
la vez anterior. Si vienes de una rutina se busca primero en esa rutina.

**Cardio.** Carrera, andar, bici, elíptica, remo y natación, aparte de la fuerza: duración
(`45`, `45:30` o `1:05:30`), distancia opcional, fecha y notas. El ritmo sale en la unidad
de cada deporte: min/km corriendo o andando, km/h en bici, /500 m en remo, /100 m nadando.
En *Progreso*, los km y sesiones del mes y, por deporte, el mejor ritmo y la más larga. El
cardio cuenta para la XP, para los objetivos de entrenos y km y como día de entreno en las
correlaciones.

## Ingresos y saldo

Los ingresos van en **su propia lista**, no mezclados con los gastos: el presupuesto, las
categorías y las comparaciones asumen que todo lo de `expenses` es una salida.

Al apuntar un movimiento eliges *Gasto* o *Ingreso* (el importe se conserva si cambias).
La pestaña enseña el **saldo del mes** — ingresos menos gastos, y qué porcentaje de lo que
ha entrado te has gastado — y los ingresos salen en verde entre los movimientos. Un gasto
fijo puede ser también ingreso, así que la nómina se apunta sola.

## Inventario y lista de la compra

La compra **no se escribe a mano**: sale del inventario. Cada producto tiene un solo
estado — está en casa o falta — y con eso basta:

```
Inventario:  marcas "se ha acabado"  →  el producto aparece en Compra
Compra:      marcas que lo compraste →  vuelve al inventario como "en casa"
```

Un booleano por producto, y la lista de la compra es una **vista**, no otra lista que
mantener sincronizada a mano. La compra también asoma en la portada cuando falta algo.

La lista de la compra antigua se convierte al abrir la app: lo que estaba apuntado era lo
que faltaba, así que entra como *falta*.

## Gastos: comparación y evolución por categoría

Cada categoría se compara con **el mismo mes anterior** (`Comida 210 €  +18%`), en rojo si
sube y en verde si baja. Un número suelto no dice nada; comparado, sí.

Y el gráfico de seis meses tiene un selector: se puede ver el total o **una categoría
sola**, que es donde se ven las fugas que el total esconde.

## Gimnasio: historial por ejercicio, 1RM y descarga

**Historial por ejercicio.** En Progreso, tocando un récord se abre todo lo que has hecho
de ese ejercicio: cada sesión con sus series, de lo más reciente a lo más viejo.

**1RM estimado** por la fórmula de Epley — `peso × (1 + reps/30)`. Es una estimación, no
un máximo levantado, pero permite comparar una serie de 5 con una de 12, que a ojo no se
puede.

**Medidas corporales.** Cintura, cadera, pecho, brazo y muslo, con el cambio desde la
primera medida en verde o rojo según vaya en la buena dirección (la cintura, bajando; el
brazo, subiendo). El peso engaña cuando ganas músculo y pierdes grasa a la vez.

**Récords por repeticiones.** En el historial de cada ejercicio: tu mejor peso para **al
menos** 1, 3, 5 y 10 repeticiones. Tu récord a 6 y el de 12 son cosas distintas.

**Descarga cada 5 semanas** (configurable). Cuando llevas ese tiempo subiendo, la pestaña
avisa; al aceptar, los pesos de las rutinas bajan **al 60 %** durante una semana y vuelven
solos al acabar. El calentamiento no se toca y la sobrecarga progresiva se desactiva
mientras dura: la descarga es el freno que evita estancarse o lesionarse.

## Notas con etiquetas

Las etiquetas **salen del propio texto**: cualquier `#palabra` en una nota. No hay gestor de
etiquetas que mantener, y funcionan también en las notas que ya tenías. Arriba de la lista
aparecen todas con su recuento, y tocando una se filtra.

## Reloj del iPhone

Lo que suena desde la app **Reloj** es una alarma del sistema: suena con Bitácora **cerrada
del todo**, con el móvil en silencio y en Concentración. Es lo único que una web no puede
garantizar por sí misma sin un servidor de push, y así sale gratis.

Una web no puede tocar la app Reloj, pero sí lanzar un **atajo** tuyo con datos dentro:

```
shortcuts://run-shortcut?name=Temporizador&input=text&text=1500
shortcuts://run-shortcut?name=Alarma&input=text&text=19:00|Tres horas de gamedev
```

Dos atajos, con los pasos exactos en *Ajustes → Reloj del iPhone*:

- **Temporizador** — recibe segundos: *Obtener números de la entrada* → *Iniciar
  temporizador*.
- **Alarma** — recibe `HH:MM|texto`: *Dividir texto* por `|` → la hora con *Obtener
  fechas de la entrada* → *Crear alarma* con esa hora y el texto como etiqueta.

Dónde se usa:

| | |
|---|---|
| **Pomodoro** | encendido — al empezar cada bloque |
| **Recordatorios** | encendido — al crearlos, y con un botón *Reloj* en cada uno |
| **Descanso del gimnasio** | **apagado**: serían unos veinte saltos a Atajos por sesión |

Donde suena el del Reloj, la app **no programa su propia alarma de audio**: dos alarmas a
la vez solo molestan.

**Las pegas, sin adornos:**

- Cada lanzamiento **saca de Bitácora** para abrir Atajos, y se vuelve a mano. No hay forma
  de que el atajo devuelva a la app instalada: abrir su dirección iría a Safari, que tiene
  su propia copia de los datos.
- Las alarmas se crean **sin repetición**. Atajos no deja recibir los días de la semana
  desde fuera de forma fiable; para que se repitan hay que marcar los días una vez en el
  Reloj.
- El nombre del atajo tiene que coincidir **exactamente**. Si no, iOS abre Atajos y dice que
  no lo encuentra. Hay botones de *Probar* para comprobarlo antes de fiarse.

## Pomodoro

Pestaña **Foco**: bloques de trabajo y descansos, con descanso largo cada N bloques. Todo
configurable (25/5/15 y cada 4 por defecto), con el recuento de bloques y minutos del día.

Guarda el **instante en que acaba** el bloque, no lo que queda, así que la cuenta sigue
bien después de una recarga o de un rato con la pantalla apagada. El aviso va programado
en el grafo de audio — el mismo truco que el descanso del gimnasio — así que **suena con
el móvil bloqueado** y el modo No molestar no lo silencia. Comparte ese motor con el
descanso del gym: si arrancas uno, el otro se calla.

### Bloquear el móvil: lo que no puede hacer una web

Una web **no puede** bloquear el teléfono ni limitar apps. Eso es el **Modo Concentración**
de iOS y no hay API para activarlo desde una página.

Lo que sí funciona es lanzar un **Atajo** tuyo con el esquema `shortcuts://run-shortcut`:

1. En *Ajustes → Concentración*, un modo (por ejemplo *Trabajo*) que permita solo las
   llamadas que quieras.
2. En *Atajos*, uno con la acción *Definir modo Concentración → Trabajo → Activar*.
3. El nombre de ese atajo, en Foco → Activar concentración.

Al lanzarlo, iOS sale de Bitácora un instante. La alarma sigue programada en el motor de
audio, así que suena igual.

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

**Ritmo de lectura.** Cada vez que guardas el punto de libro queda registrado. Con eso la
app sabe a qué ritmo lees **ahora** — usa el tramo de las últimas tres semanas, y si no hay
registro, la media desde que empezaste — y te dice cuándo lo acabas: *"12 pág/día · lo
acabas el 24 oct"*.

**Citas.** Frases guardadas dentro de la ficha de cada obra, con página en los libros.

Las **series** marcan por dónde vas con temporada y episodio (`T2 E5`), igual que los
libros marcan la página.

## Gimnasio: qué toca hoy

Cada rutina puede llevar asignados **días de la semana**. Las de ejemplo vienen con un
reparto de cinco días: Empuje lunes y jueves, Tirón martes y viernes, Pierna miércoles.

En la portada, el cuadro de gimnasio enseña **la rutina que toca hoy** según ese
calendario, con un botón para empezarla. Si ya la hiciste, lo dice y no te la vuelve a
ofrecer. Y si hoy no hay ninguna asignada, lo dice también: *día de descanso*.

Sin días asignados, se mantiene el comportamiento anterior: se propone la rutina que
lleves **más tiempo sin hacer**. Cada rutina indica además cuándo la hiciste por última
vez, y la que toca lleva la marca **hoy** (o **te toca**, cuando se decide por atraso).

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
