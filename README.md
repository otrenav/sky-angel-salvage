
# Sky Angel Web

## Pendientes

### Generales

- [x] Pestañas con mayúsculas
- [x] Pestañas para usuario y sesión
- [x] Separar cajas de métricas (arriba)
- [x] Probar con pantalla de 1920x1080
  - [x] Pantalla pequeña sin "scroll"
  - [x] Pantalla con controles fuera de alcance
  - [x] Logo demasiado grande en pantallas pequeñas
- [x] Arreglar que no se tenga que "actualizar" varias veces la página
  - TODO: Verificar con José Luis que ya no le ocurre

### FENIX

- [ ] Animación de vectores
  - [ ] Inicialmente:
    - [ ] Vectores con mismo color por cliente
    - [ ] Ningún vector muestra ícono "localizador"
  - [ ] Al dar clic:
    - [ ] Demás vectores se "atenuan"
    - [ ] Vector elegido activa su ícono de "localizador"
      - [ ] Ícono "localizador" con palpitaciones y "sonido"
    - [ ] Vector elegido cambia parte "recorrida" a gris claro
- [x] Etiquetas con mayor espacio para que no se lea como "todos terrestres"

### ARES

- [x] Leyenda de colores para "heatmaps" menos gruesa
- [x] Etiquetas de "todos"/"ninguna" con mayor espacio y alineadas verticalmente
- [ ] Filtro por día primero y después por hora
  - [ ] No se deben mostrar observaciones para días distintos al mismo tiempo
  - [ ] Si no se han seleccionado horas específicas se debe mostrar la
        información de todo el día simultáneamente

## Preguntas

### FENIX

Por ahora se recibe un vector con los siguientes valores, en orden:

- `ID_NUMERO`
- `ENTERO_1_o_2`
  - ¿Qué es esto?
- `COORD_INICIO_LAT`
- `COORD_INICIO_LNG`
- `COORD_FINAL_LAT`
- `COORD_FINAL_LNG`
- `ID_TEXTO_CLIENTE`

- ¿Cómo recibiremos la información de "recorrido" para los vectores?
  - Paris mencionó que hay objetos de fecha para los valores de inicio del
    recorrido y final (una estimación, imagino) del recorrido, pero ¿cómo
    sabemos en qué parte del trayecto va? ¿Lo calculamos con la fecha/tiempo
    actuales al cargar la página o hay un valor para ello?
- La información de si un vector debe ser contado como "terrestre"/"naviero",
  ¿es a nivel de vector o de cliente? Y, ¿cómo la recibimos? Actualmente estoy
  considerando nivel cliente y lo estoy colocando en el objeto de definición del
  clientes (`./public/static/js/fenix-constants.js`).
- Actualmente se ven "jittery" alrededor de los vectores porque hay múltiples
  vectores con puntos iniciales y finales en las exactas mismas coordenadas.
  ¿Por qué es esto? ¿Se refieren a diferentes transportes sobre esa ruta o es un
  mismo transporte con varias observaciones? Por ahora eliminaré duplicados para
  limpiar la visualización.
- ¿Cómo obtenemos la información de importaciones/exportaciones para las tablas?

### ARES

Por ahora se recibe la información del "heatmap" con un diccionario con llaves
por hora del día y con una lista de listas con las coordenadas dentro. Sin
embargo José Luis mencionó que se debe filtrar primero por día y después por
hora (por ahora está sólo por hora). Me parece que la estructura podría ser
entonces anidar en un diccionario de días las observaciones por hora. Es decir,
un objeto como el que está actualmente en `./public/static/js/ares-constants.js`
pero para cada día. ¿Qué opinas Paris? Por ahora haré eso porque me parece la
mejor opción, podemos coordinar esas traducciones en cuanto hablemos.
