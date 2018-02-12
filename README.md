
# Sky Angel Web

## Notas

### FENIX

La estructura de datos es una lista de listas, donde cada una de las listas
internas (observación) tiene los siguientes valores:

- `ID_NUMERO` (int)
- `IMP_VS_EXP` (int: `1` importación, `2` exportación)
- `COORD_INICIO_LAT` (float: coordenada)
- `COORD_INICIO_LNG` (float: coordenada)
- `COORD_FINAL_LAT` (float: coordenada)
- `COORD_FINAL_LNG` (float: coordenada)
- `FECHA_EST_SALIDA` (date)
- `FECHA_EST_LLEGADA` (date)
- `ID_TEXTO_CLIENTE` (string)

1. Sky Angel especificó que hay varios movimientos con orígenes/destinos
   identicos,porque son varios transportes o convoys, y quieren ver un vector
   por cada uno de ellos.

2. El "porcentaje recorrido" de cada vector se debe calcular con base en las
   fechas estimadas de salida y llegada (`FECHA_EST_SALIDA`,
   `FECHA_EST_LLEGADA`) en comparación con la fecha/hora actual al momento de
   cargar la página.

3. Los clientes se clasifican como "terrestres" o "navieros" (mutuamente
   excluyentes). Arcor, Intermodal Maersk, Maersk, C4, CIS, DHL Marítimo, Damco,
   Hellmann, Hamburg Sud, Jah, Mol, MSC y Naviero pertenecen a "navieros". Los
   demás pertenecen a "terrestres".

   - Última información que hizo llegar José Luis especifíca:
     - Navieros:
       - ARC, C4, CIS, DCX, DHL, DMC, GEO, HEL, HSD
       - JAH, MOL, MSC, MSK, NAV, SMT, SSA
     - Terrestres:
       - DHLT, NAVT, OIL, SUN
     - Sin especificar:
       - NTA

### ARES

La estructura de datos es un diccionario de diccionarios, donde cada uno de los
diccionarios de primer nivel (días) tiene un diccionario dentro (horas), cuyos
elementos son listas de listas. Esas listas de listas contienen pares (cada
lista interna tiene dos elementos) con las coordenadas de cada punto del
`HEATMAP`.

Ejemplo:

```
var HEATMAPS = {
    'Lunes': {
        '01:00': { coords: [[20.11106791, -95.84941333]] },
        '02:00': { coords: [[16.11106791, -99.32388323]] },
        ...
        '24:00': { coords: [[22.04040261, -99.4937895]] }
    },
    ...
    'Domingo': {
        '01:00': { coords: [[20.11106791, -96.23423322]] },
        '02:00': { coords: [[18.11106791, -98.84941333]] },
        ...
        '24:00': { coords: [[21.23234323, -101.4937895]] }
    }
}
```

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
    - [x] Inicialmente:
      - [x] Vectores con mismo color por cliente
      - [x] Ningún vector muestra ícono "localizador"
    - [ ] Al dar clic:
      - [ ] Demás vectores se "atenuan"
      - [x] Vector elegido activa su ícono de "localizador"
        - [x] Ícono "localizador" con palpitaciones
    - [x] Vector elegido cambia parte "recorrida" a otro color
- [x] Etiquetas con mayor espacio para que no se lea como "todos terrestres"
- [x] Poder ver a nivel de calles la ubicación de un vector (agregar colores)
- [x] Eliminar vectores duplicados para no ver imágenes con "jitter"
- [x] Actualizar información de cajas cuando cambian los clientes

#### Ajustes

- [x] Usar indicadores de importación (1) o exportación (2)
- [x] Para calcular el porcentaje recorrido debemos usar aproximaciones dado
      los estimados de salida y llegada (objetos de fecha)
- [x] Bug: cuando se desactiva y re-activa un "cliente", los tramos de vectores
      "activos" siguen estando activos y deberían estar "inactivos"
- [x] Usar el "tache" para "desactivar" el vector seleccionado
- [x] Que el callejero aparezca hasta que se haga "zoom"
- [x] Cambiar ícono de palpitaciones a blanco
- [x] Cambiar a "gris claro" el color del vector "activo"
- [x] Regresar a vectores más delgados
- [x] Arcor, Intermodal Maersk, Maersk c4, CIS, DHL Marítimo, Damco, Hellmann,
      Hamburg Sud, Jah, Mol, MSC y Naviero pertenecen a Navieros. Las demás
      pertenecen a terrestres.

### ARES

- [x] Leyenda de colores para "heatmaps" menos gruesa
- [x] Etiquetas de "todos"/"ninguna" con mayor espacio y alineadas verticalmente
- [x] Filtro por día primero y después por hora
    - [x] No se deben mostrar observaciones para días distintos al mismo tiempo
    - [x] Si no se han seleccionado horas específicas se debe mostrar la
          información de todo el día simultáneamente

## Preguntas

- Sin preguntas por ahora.
