# Contexto del Proyecto: GesMenu

## 1. Arquitectura Técnica
- **Backend:** Google Apps Script (`Code.js`).
- **Frontend:** HTML5 + JavaScript + Pico.css (`Index.html`).
- **Base de Datos:** Google Sheets.

## 2. Estructura del Spreadsheet (Mandatorio)

### Pestaña: `Configuracion`
- **Columna A:** Lista de nombres de los jugadores registrados.
- El script usa la función `findSheet` para buscar esta pestaña de forma flexible (ignora mayúsculas y espacios).

### Pestaña: `Menu`
Contiene las opciones de platos organizadas en 8 columnas fijas:
1. `CenaV`
2. `PostreV`
3. `ComidaS1`
4. `ComidaS2`
5. `PostreComidaS`
6. `CenaS`
7. `PostreCenaS`
8. `PicnicD`

### Pestaña: `Respuestas`
Registra las elecciones con la siguiente estructura (13 columnas):
`Jugador | Tipo | Nombre | CenaV | PostreV | ComidaS1 | ComidaS2 | PostreComidaS | CenaS | PostreCenaS | PicnicD | Observaciones | Timestamp`

## 3. Convenciones de UI/UX (Mobile-First)
- **Controles Segmentados:** No usar `<select>`. Se utilizan botones de ancho completo (radio buttons/checkboxes estilizados) para selección directa en un solo toque.
- **Acordeones:** Las tarjetas de acompañantes deben ser colapsables para reducir el scroll vertical. El título de la cabecera debe sincronizarse con el input del nombre.
- **Picnic Domingo:** Es una sección de multiselección fija. Las opciones aparecen marcadas en azul y deshabilitadas para que el usuario no pueda cambiarlas.

## 4. Lógica de Sincronización
- **Búsqueda Flexible:** Siempre usar `findSheet(nombre)` en lugar de `ss.getSheetByName(nombre)` para evitar errores por espacios accidentales en los nombres de las pestañas.
- **Limpieza de Datos:** Aplicar `.trim()` a todos los valores leídos de las celdas para asegurar comparaciones correctas en el frontend.
- **Recuperación:** Al seleccionar un jugador, el script recupera tanto las opciones disponibles en `Menu` como las elecciones previas en `Respuestas`.

## 5. Flujo de Trabajo
- Los cambios en `src/Code.js` e `src/Index.html` deben subirse a Google Apps Script (preferiblemente vía `clasp push`).
- La rama `main` de GitHub es la fuente de verdad.
