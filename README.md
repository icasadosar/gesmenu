# GesMenu - Gestión de Menús para Torneos

## 1. Resumen del Proyecto
Aplicación web ligera para la gestión de elecciones de menú durante un torneo de 3 días, diseñada específicamente para uso en dispositivos móviles (90% del tráfico esperado).

## 2. Requisitos Funcionales
- **Usuarios:** 16 jugadores pre-registrados + familiares ilimitados.
- **Identificación:** Selección de nombre desde lista desplegable.
- **Edición:** Si el jugador ya envió datos, el sistema los recupera para su modificación.
- **Registro en bloque:** Un solo envío por jugador incluyendo a todos sus acompañantes.
- **Estructura de Comidas:**
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
4. Cena Viernes
5. Comida Sábado - Primero
6. Comida Sábado - Segundo
7. Comida Sábado - Postre
8. Cena Sábado
9. Picnic Domingo
10. Observaciones
11. Timestamp

## 5. Gestión con GitHub

Se recomienda organizar el repositorio de la siguiente manera:

```text
/gesmenu
├── src/
│   ├── Código.js    # Lógica de Apps Script
│   └── Index.html   # Interfaz de usuario
├── .clasp.json      # Configuración de sincronización
├── appsscript.json  # Manifiesto de Google
└── README.md        # Instrucciones de uso
```

### Sincronización con CLASP
Para mantener el código en GitHub y desplegarlo en Google:
1. `npm install -g @google/clasp`
2. `clasp login`
3. `clasp clone "ID_DEL_SCRIPT"`
4. `clasp push` (Para enviar cambios a Google Sheets)
5. `git push origin main` (Para enviar cambios a GitHub)
