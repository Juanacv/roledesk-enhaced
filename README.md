# 🐉 RoleDesk Enhanced — Tablero Táctico Virtual (VTT) para D&D

**RoleDesk Enhanced** es una aplicación web interactiva basada en **HTML5, SVG, JavaScript (`interact.js` + jQuery) y PHP** diseñada como tablero táctico virtual (*Virtual Tabletop*) para dirigir partidas de **Dungeons & Dragons** y juegos de rol de mesa sobre mapas de mazmorras (*dungeons*).

---

## ✨ Características Principales

### 🗺️ Tablero Táctico y Cuadrícula Métrica
* **Lienzo SVG Interactivo (`1250 × 975 px`)**: Escenario con soporte para mapas de fondo personalizados y guardado/carga de escenas completas en archivos `.svg`.
* **Rejilla Táctica Conmutable (`16 × 13` casillas)**: Cuadrícula superpuesta donde cada casilla de `75 × 75 px` equivale a **1,5 metros** (Sistema Internacional).

### 🛡️ Fichas Vectoriales SVG (Héroes y Bestiario)
Generación nativa en SVG de fichas circulares con iconografía propia, nombre personalizable y selector de estado (`Bien`, `Herido`, `Herido Grave`, `Aturdido`, `Envenenado`, `Paralizado`, `Pánico`, `Hechizado`, `Muerto`, etc.):
* **12 Clases de Héroe (D&D)**: Paladín, Mago, Hechicero, Guerrero, Pícaro, Clérigo, Explorador, Bárbaro, Bardo, Druida, Monje y Brujo.
* **19 Criaturas y Jefes del Bestiario**:
  * *Humanoides y Saqueadores*: Trasgo (Goblin), Orco Berserker, Kobold, Bandido/Mercenario, Cultista Oscuro.
  * *No-Muertos*: Esqueleto, Zombi, Señor Vampiro, Liche.
  * *Bestias y Trampas de Dungeon*: Lobo/Huargo, Araña Gigante, Cofre Mímico, Cubo Gelatinoso, Ogro/Troll.
  * *Jefes y Aberraciones*: Contemplador (*Beholder*), Azotamentes (*Illithid*), Demonio/Diablo, Elemental y Dragón.

### ⚔️ Acciones, Defensas y Áreas de Conjuro (AoE)
* **Líneas de Ataque Articuladas (`flexyLine`)**: Polilíneas con punta de flecha direccional, rotación orbital, subdivisión de vértices al arrastrar puntos intermedios y selector de arma/ataque (`Espada corta`, `Espada larga`, `Mandoble`, `Arco`, `Flecha`, `Ballesta`, `Virote`, `Daga`, `Hechizo`, etc.).
* **Etiquetas de Defensa (`analogBox`)**: Marcadores arrastrables de reacción o defensa (`Escudo`, `Armadura`, `Esquivar`, `Contraataque`, `Hechizo`, etc.).
* **Plantillas de Área de Efecto (AoE)**: Esferas translúcidas a escala métrica real sobre la cuadrícula:
  * 🔥 *Bola de Fuego* (`6 m` de radio)
  * ❄️ *Explosión Helada* (`4,5 m` de radio)
  * ✨ *Aura Mágica* (`3 m` de radio)
  * ☠️ *Nube Venenosa* (`4,5 m` de radio)
  * ☀️ *Luz Sagrada* (`7,5 m` de radio)

### 🎲 Herramientas de Dungeon Master Integrada
* **Lanzador de Dados Poliédridos**: Soporte para `d4`, `d6`, `d8`, `d10`, `d12`, `d20` y `d100` con selector de cantidad de dados, modificador y aviso sonoro/visual de **Crítico Natural (20)** y **Pifia (1)**.
* **⚡ Orden de Iniciativa y Puntos de Golpe (HP)**:
  * Al invocar cualquier **enemigo** en el mapa, se añade automáticamente al Orden de Iniciativa tirando `1d20 + su modificador` y asignándole sus puntos de vida (`HP`) oficiales.
  * Control de rondas, resaltado del turno activo y botones rápidos `+` / `-` para gestionar el daño y la curación en vivo.
* **📜 Crónica de Combate**: Registro cronológico de todas las tiradas, turnos, invocaciones y cambios en el tablero.

---

## 🚀 Instalación y Uso

1. Clona este repositorio en tu servidor web con soporte PHP (por ejemplo, **XAMPP** / Apache):
   ```bash
   git clone https://github.com/Juanacv/roledesk-enhaced.git
   ```
2. Asegúrate de que las carpetas `images/background/` y `templates/` tengan permisos de escritura para poder subir nuevos mapas y guardar plantillas SVG.
3. Abre el proyecto en tu navegador (ej. `http://localhost/roledesk` o mediante VirtualHost en `http://roledesk.local/`).

### Controles Rápidos en el Mapa
* **Arrastrar**: Mueve fichas, etiquetas de defensa, áreas de conjuro o líneas de ataque.
* **Arrastrar el nodo central blanco de una línea**: Divide el segmento para doblar la línea de ataque y esquivar obstáculos.
* **Arrastrar el nodo naranja de una línea**: Gira toda la línea de ataque alrededor de su centro.
* **Doble clic**: Elimina cualquier elemento del tablero (o elimina un vértice intermedio si haces doble clic sobre un nodo blanco).
