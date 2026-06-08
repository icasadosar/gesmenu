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

/**
 * Crea el menú personalizado al abrir el Spreadsheet.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🏆 Gestión Torneo')
      .addItem('Generar PDFs de Menús', 'generarPDFs')
      .addToUi();
  } catch (e) {
    // Si falla es porque se está ejecutando desde el editor o un trigger sin UI
    console.warn('No se pudo crear el menú: ' + e.toString());
  }
}

/**
 * Agrupa las respuestas y genera un PDF por cada Jugador Principal
 * utilizando una plantilla de Google Docs.
 */
function generarPDFs() {
  let ui = null;
  try {
    ui = SpreadsheetApp.getUi();
  } catch (e) {
    console.error('Esta función debe ejecutarse desde el menú de la Hoja de Cálculo.');
    return;
  }
  
  // =========================================================================
  // CONFIGURACIÓN: INSERTA TUS IDs AQUÍ
  // =========================================================================
  // 1. Crea un Google Doc como plantilla y copia su ID de la URL
  const TEMPLATE_ID = '1jBCzzbxXGegCdbVU2M0GCHMUVERM75-KFdySSvaiWik'; 
  
  // 2. Crea una carpeta en Google Drive para guardar los PDFs y copia su ID
  const FOLDER_ID = '1M1_Ub9gDkDwiLwelO8nsLGJQLgLLRQcT'; 
  // =========================================================================
  
  if (TEMPLATE_ID === 'template_id' || FOLDER_ID === 'folder_id') {
    ui.alert(
      'Configuración Pendiente', 
      'Debes abrir el editor de secuencias de comandos y configurar los IDs de la plantilla (TEMPLATE_ID) y la carpeta (FOLDER_ID) en el archivo PdfGenerator.gs.', 
      ui.ButtonSet.OK
    );
    return;
  }

  const sheet = findSheet('Respuestas'); // Usa la función existente en Code.js
  if (!sheet) {
    ui.alert('Error', 'No se encuentra la pestaña Respuestas.', ui.ButtonSet.OK);
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    ui.alert('Aviso', 'No hay respuestas para generar PDFs.', ui.ButtonSet.OK);
    return;
  }
  
  // Ignorar cabecera
  const rows = data.slice(1);
  
  // Agrupar por jugador (Columna A - índice 0)
  const grupos = {};
  rows.forEach(row => {
    const jugador = row[0] ? row[0].toString().trim() : '';
    if (!jugador) return;
    
    if (!grupos[jugador]) {
      grupos[jugador] = [];
    }
    
    grupos[jugador].push({
      tipo: row[1] ? row[1].toString().trim() : '',
      nombre: row[2] ? row[2].toString().trim() : '',
      cenaV: row[3] ? row[3].toString().trim() : '',
      postreV: row[4] ? row[4].toString().trim() : '',
      comidaS1: row[5] ? row[5].toString().trim() : '',
      comidaS2: row[6] ? row[6].toString().trim() : '',
      postreComidaS: row[7] ? row[7].toString().trim() : '',
      cenaS: row[8] ? row[8].toString().trim() : '',
      postreCenaS: row[9] ? row[9].toString().trim() : '',
      picnicD: row[10] ? row[10].toString().trim() : '',
      observaciones: row[11] ? row[11].toString().trim() : ''
    });
  });

  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    let generados = 0;
    
    // UI Feedback: Toast
    SpreadsheetApp.getActiveSpreadsheet().toast('Iniciando generación de PDFs...', 'Proceso en curso', 5);
    
    for (const jugador in grupos) {
      const comensales = grupos[jugador];
      
      // Crear copia temporal del documento plantilla
      const fileDoc = DriveApp.getFileById(TEMPLATE_ID).makeCopy(`Temporal_${jugador}`);
      const doc = DocumentApp.openById(fileDoc.getId());
      const body = doc.getBody();
      
      // Reemplazar etiqueta general
      body.replaceText('{{JUGADOR}}', jugador);
      
      // Construir el texto de los menús
      let textoMenus = '';
      
      comensales.forEach(c => {
        textoMenus += `👤 ${c.tipo.toUpperCase()}: ${c.nombre}\n`;
        if (c.observaciones) {
          textoMenus += `⚠️ ALERGIAS/OBSERVACIONES: ${c.observaciones}\n`;
        }
        textoMenus += `🍽️ Cena Viernes:\n   - ${c.cenaV}\n   - ${c.postreV}\n`;
        textoMenus += `🍽️ Comida Sábado:\n   - ${c.comidaS1}\n   - ${c.comidaS2}\n   - ${c.postreComidaS}\n`;
        textoMenus += `🍽️ Cena Sábado:\n   - ${c.cenaS}\n   - ${c.postreCenaS}\n`;
        textoMenus += `🎒 Picnic Domingo:\n   - ${c.picnicD}\n`;
        textoMenus += `\n----------------------------------------\n\n`;
      });
      
      // Reemplazar la etiqueta de menús con todo el bloque de texto
      body.replaceText('{{MENUS}}', textoMenus);
      
      // Guardar cambios antes de generar el PDF
      doc.saveAndClose();
      
      // Convertir a PDF y guardar en la carpeta de destino
      const blob = fileDoc.getAs(MimeType.PDF);
      // Reemplazamos espacios por guiones bajos para el nombre del archivo
      blob.setName(`Menu_Torneo_${jugador.replace(/\s+/g, '_')}.pdf`);
      folder.createFile(blob);
      
      // Eliminar el documento temporal enviándolo a la papelera
      fileDoc.setTrashed(true);
      
      generados++;
    }
    
    ui.alert('Proceso Completado', `Se han generado con éxito ${generados} PDFs en la carpeta de destino.`, ui.ButtonSet.OK);
    
  } catch (e) {
    console.error(e);
    ui.alert('Error en el proceso', 'Ocurrió un error (verifica que los IDs sean correctos y tengas permisos): ' + e.message, ui.ButtonSet.OK);
  }
}
