# GesMenu - Gestión de Menús para Torneos

## 1. Resumen del Proyecto
Aplicación web ligera para la gestión de elecciones de menú durante un torneo de 3 días, diseñada específicamente para uso en dispositivos móviles (90% del tráfico esperado).

## 2. Requisitos Funcionales
- **Usuarios:** 16 jugadores pre-registrados + familiares ilimitados.
- **Identificación:** Selección de nombre desde lista desplegable superior.
- **Acompañantes:** Solo los acompañantes eligen menú. El jugador principal se registra automáticamente sin elección de comida.
- **Edición:** Si el jugador ya envió datos, el sistema los recupera para su modificación.
- **Registro en bloque:** Un solo envío por jugador incluyendo a todos sus acompañantes.
- **Estructura de Comidas (Solo Acompañantes):**
    - **Cena Viernes:** 2 opciones.
    - **Comida Sábado:** 3 pases (Primero, Segundo, Postre) con 2 opciones cada uno.
    - **Cena Sábado:** 2 opciones.
    - **Picnic Domingo:** 2 opciones.
- **Observaciones:** Campo de texto único para alergias o comentarios del grupo.

## 3. Arquitectura Técnica
- **Frontend:** HTML5/JS con Pico.css (Framework ligero Mobile-First).
- **Backend/API:** Google Apps Script (GAS).
- **Base de Datos:** Google Sheets.

## 4. Estructura de la Base de Datos (Google Sheets)

### Pestaña: `Configuracion`
- Columna A: Lista de los 16 nombres de los jugadores.

### Pestaña: `Respuestas`
Columnas (en orden):
1. ID Grupo (Nombre del Jugador principal)
2. Tipo (Jugador / Acompañante)
3. Nombre Comensal
4. Cena Viernes (Para jugador será "N/A")
5. Comida Sábado - Primero
6. Comida Sábado - Segundo
7. Comida Sábado - Postre
8. Cena Sábado
9. Picnic Domingo
10. Observaciones
11. Timestamp

## 5. Instrucciones de Instalación (Paso a Paso)

Si no utilizas CLASP, sigue estos pasos para poner la web en marcha:

### Paso 1: Preparar la Hoja de Google
1. Crea una nueva Google Sheet.
2. Cambia el nombre de la primera pestaña a `Configuracion`.
    - En la **Columna A**, escribe la lista de los 16 jugadores (un nombre por fila).
3. Crea una segunda pestaña llamada `Respuestas`.

### Paso 2: Configurar el Script
1. En tu Google Sheet, ve a **Extensiones > Apps Script**.
2. En el editor, cambia el nombre de `Código.gs` a `Code.gs` y pega el contenido de `src/Code.js`.
3. Crea un archivo HTML llamado `Index` y pega el contenido de `src/Index.html`.

### Paso 3: Desplegar la Aplicación Web
1. Haz clic en **Implementar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. **Ejecutar como:** Tú.
4. **Quién tiene acceso:** Cualquiera.

---

## 6. Gestión con GitHub

```text
/gesmenu
├── src/
│   ├── Code.js      # Lógica de Apps Script (Backend)
│   └── Index.html   # Interfaz de usuario (Frontend)
├── appsscript.json  # Manifiesto de Google
└── README.md        # Esta guía
```
