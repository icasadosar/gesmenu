function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Menú Torneo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getJugadores() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Configuracion');
    if (!sheet) return ["Error: No existe pestaña 'Configuracion'"];
    
    const lastRow = sheet.getLastRow();
    // Si la hoja está vacía, lastRow es 0. getRange fallaría.
    if (lastRow < 1) return []; 
    
    const values = sheet.getRange(1, 1, lastRow, 1).getValues();
    // Filtramos celdas vacías y aplanamos el array
    return values.flat().map(v => v.toString().trim()).filter(v => v !== "");
  } catch (e) {
    return ["Error en el servidor: " + e.toString()];
  }
}

function guardarRespuestas(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Respuestas');
  if (!sheet) return "Error: No existe pestaña Respuestas";
  
  const jugadorPrincipal = datos.jugador;
  const rows = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] === jugadorPrincipal) {
      sheet.deleteRow(i + 1);
    }
  }
  
  const timestamp = new Date();
  datos.comensales.forEach(c => {
    sheet.appendRow([
      jugadorPrincipal,
      c.tipo,
      c.nombre,
      c.cenaV,
      c.comidaS1,
      c.comidaS2,
      c.comidaS3,
      c.cenaS,
      c.picnicD,
      datos.observaciones,
      timestamp
    ]);
  });
  
  return "¡Guardado con éxito!";
}

function getDatosPrevios(nombreJugador) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Respuestas');
  if (!sheet) return null;
  const rows = sheet.getDataRange().getValues();
  const datos = rows.filter(r => r[0] === nombreJugador);
  
  if (datos.length === 0) return null;
  
  return {
    observaciones: datos[0][9],
    comensales: datos.map(d => ({
      tipo: d[1],
      nombre: d[2],
      cenaV: d[3],
      comidaS1: d[4],
      comidaS2: d[5],
      comidaS3: d[6],
      cenaS: d[7],
      picnicD: d[8]
    }))
  };
}
