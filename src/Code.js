function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Menú Torneo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función auxiliar para buscar una hoja de forma flexible (ignora mayúsculas y espacios)
 */
function findSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  const sheets = ss.getSheets();
  const searchName = name.toLowerCase().replace(/\s/g, '');
  return sheets.find(s => s.getName().toLowerCase().replace(/\s/g, '') === searchName) || null;
}

function getJugadores() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error("No se pudo acceder al Spreadsheet.");
    
    // El usuario aclara que los jugadores están en 'Configuracion'
    // y que en 'Menu' están los platos.
    const sheet = findSheet('Configuracion') || findSheet('Jugadores') || findSheet('Menu');
    
    if (!sheet) {
      console.error("No se encontró la pestaña 'Configuracion'");
      return ["Error: No se encontró la pestaña 'Configuracion' con los nombres."];
    }

    console.log("Cargando jugadores desde la pestaña: " + sheet.getName());
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 1) return [];
    
    // Obtenemos solo la Columna A (donde están los nombres)
    const values = sheet.getRange(1, 1, lastRow, 1).getValues().flat();
    
    let jugadores = values.map(v => v.toString().trim()).filter(v => v !== "");
    
    // Ignorar encabezado común si existe
    const headers = ["nombre", "jugador", "jugadores", "lista", "id", "nombres"];
    if (jugadores.length > 0 && headers.includes(jugadores[0].toLowerCase())) {
      jugadores.shift();
    }
    
    console.log("Total jugadores cargados: " + jugadores.length);
    return jugadores;
  } catch (e) {
    console.error("Error en getJugadores: " + e.toString());
    return ["Error en el servidor: " + e.message];
  }
}

function guardarRespuestas(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = findSheet('Respuestas');
    if (!sheet) throw new Error("No existe la pestaña 'Respuestas'");
    
    const jugadorPrincipal = datos.jugador.trim();
    const rows = sheet.getDataRange().getValues();
    
    // Borrar registros previos del mismo jugador (comparación insensible)
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][0].toString().trim().toLowerCase() === jugadorPrincipal.toLowerCase()) {
        sheet.deleteRow(i + 1);
      }
    }
    
    const timestamp = new Date();
    datos.comensales.forEach(c => {
      sheet.appendRow([
        jugadorPrincipal,
        c.tipo,
        c.nombre.trim(),
        c.cenaV,
        c.postreV,
        c.comidaS1,
        c.comidaS2,
        c.postreComidaS,
        c.cenaS,
        c.postreCenaS,
        c.picnicD,
        c.observaciones || "",
        timestamp
      ]);
    });
    
    return "¡Tus elecciones se han guardado con éxito!";
  } catch (e) {
    console.error("Error en guardarRespuestas: " + e.toString());
    return "Error al guardar: " + e.message;
  }
}

function getOpcionesMenu() {
  try {
    const sheet = findSheet('Menu');
    if (!sheet) return null;
    
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return null; // Solo hay encabezado o está vacía
    
    const opciones = {
      cenaV: [],
      postreV: [],
      comidaS1: [],
      comidaS2: [],
      postreComidaS: [],
      cenaS: [],
      postreCenaS: [],
      picnicD: []
    };
    
    // Recorremos las filas omitiendo el encabezado (fila 0)
    for (let i = 1; i < values.length; i++) {
      if (values[i][0]) opciones.cenaV.push(values[i][0].toString().trim());
      if (values[i][1]) opciones.postreV.push(values[i][1].toString().trim());
      if (values[i][2]) opciones.comidaS1.push(values[i][2].toString().trim());
      if (values[i][3]) opciones.comidaS2.push(values[i][3].toString().trim());
      if (values[i][4]) opciones.postreComidaS.push(values[i][4].toString().trim());
      if (values[i][5]) opciones.cenaS.push(values[i][5].toString().trim());
      if (values[i][6]) opciones.postreCenaS.push(values[i][6].toString().trim());
      if (values[i][7]) opciones.picnicD.push(values[i][7].toString().trim());
    }
    
    return opciones;
  } catch (e) {
    console.error("Error en getOpcionesMenu: " + e.toString());
    return null;
  }
}

function getDatosPrevios(nombreJugador) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = findSheet('Respuestas');
    const opciones = getOpcionesMenu();
    
    let datosPrevios = null;
    
    if (sheet) {
      const rows = sheet.getDataRange().getValues();
      const nombreBuscado = nombreJugador.trim().toLowerCase();
      const filtrados = rows.filter(r => r[0].toString().trim().toLowerCase() === nombreBuscado);
      
      if (filtrados.length > 0) {
        datosPrevios = {
          comensales: filtrados.map(d => ({
            tipo: d[1] ? d[1].toString().trim() : "",
            nombre: d[2] ? d[2].toString().trim() : "",
            cenaV: d[3] ? d[3].toString().trim() : "",
            postreV: d[4] ? d[4].toString().trim() : "",
            comidaS1: d[5] ? d[5].toString().trim() : "",
            comidaS2: d[6] ? d[6].toString().trim() : "",
            postreComidaS: d[7] ? d[7].toString().trim() : "",
            cenaS: d[8] ? d[8].toString().trim() : "",
            postreCenaS: d[9] ? d[9].toString().trim() : "",
            picnicD: d[10] ? d[10].toString().trim() : "",
            observaciones: d[11] ? d[11].toString().trim() : ""
          }))
        };
      }
    }
    
    return {
      datos: datosPrevios,
      opciones: opciones
    };
  } catch (e) {
    console.error("Error en getDatosPrevios: " + e.toString());
    return null;
  }
}
