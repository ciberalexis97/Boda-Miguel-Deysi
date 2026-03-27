# 💍 Invitación Digital de Boda
## Miguel Ángel & Deisy Lizeth · 05 de Octubre 2027

---

## 📁 Estructura del Proyecto

```
wedding/
├── index.html           ← Página principal
├── biography.html       ← Nuestra Historia
├── itinerary.html       ← Itinerario del evento
├── css/
│   ├── styles.css       ← Estilos principales
│   └── animations.css   ← Animaciones y keyframes
├── js/
│   ├── main.js          ← JavaScript principal (navbar, música, QR, clima, etc.)
│   ├── countdown.js     ← Cuenta regresiva en tiempo real
│   └── heart-particles.js ← Animación 3D corazón de partículas (Three.js)
├── assets/              ← Carpeta de recursos (AGREGAR AQUÍ LOS ARCHIVOS)
│   ├── fondo-principal.jpg
│   ├── fondo-secundario.jpg
│   ├── fondo-tres.jpg
│   ├── foto-novio.jpg
│   ├── foto-novia.jpg
│   ├── foto-novios-juntos.jpg
│   ├── foto-papas-novio.jpg
│   ├── foto-papas-novia.jpg
│   ├── foto-padrinos.jpg
│   ├── galeria-1.jpg ... galeria-5.jpg
│   ├── momento-1.jpg ... momento-5.jpg
│   └── musica-fondo.mp3 / musica-fondo.ogg
└── README.md
```

---

## 🖼️ Imágenes Necesarias

Coloca las siguientes imágenes en la carpeta `assets/`:

| Archivo | Descripción | Dimensiones Recomendadas |
|---------|-------------|--------------------------|
| `fondo-principal.jpg` | Fondo principal del Hero | 1920×1080px mínimo |
| `fondo-secundario.jpg` | Fondo sección novios/biografía | 1920×1080px mínimo |
| `fondo-tres.jpg` | Fondo sección familia/mapas | 1920×1080px mínimo |
| `foto-novio.jpg` | Foto de Miguel Ángel | 400×400px (cuadrada) |
| `foto-novia.jpg` | Foto de Deisy Lizeth | 400×400px (cuadrada) |
| `foto-novios-juntos.jpg` | Foto de los dos juntos | 600×750px aprox |
| `foto-papas-novio.jpg` | Foto papás del novio | 600×400px |
| `foto-papas-novia.jpg` | Foto papás de la novia | 600×400px |
| `foto-padrinos.jpg` | Foto padrinos de Velación | 600×400px |
| `galeria-1.jpg` ... `galeria-5.jpg` | Fotos de galería | 800×600px |
| `momento-1.jpg` ... `momento-5.jpg` | Fotos para timeline | 800×500px |
| `musica-fondo.mp3` | Canción de fondo | Archivo MP3 |

> ⚠️ **Nota:** Si no hay imágenes, el sitio mostrará placeholders con el color de la paleta automáticamente.

---

## 🎵 Música de Fondo

1. Coloca tu canción como `assets/musica-fondo.mp3`
2. Opcionalmente agrega versión OGG como `assets/musica-fondo.ogg` para mayor compatibilidad
3. El reproductor flota en la esquina inferior derecha
4. El usuario debe dar clic para iniciar (política del navegador)

---

## 📱 WhatsApp — Confirmación de Asistencia

Edita en `js/main.js` la línea:
```javascript
generateQR('qr-whatsapp', 'https://wa.me/521XXXXXXXXXX?text=...');
```
Reemplaza `521XXXXXXXXXX` con el número de WhatsApp (con código de país, sin +):
- Ejemplo México: `5219512345678`

---

## 🗺️ Mapas

Los mapas ya están configurados con las coordenadas de los links proporcionados.
Los botones "Abrir en Maps" usan los links originales:
- **Iglesia:** https://maps.app.goo.gl/ZSJuksRRpoWQhy7r6
- **Recepción:** https://maps.app.goo.gl/tKSReS61gs7b3tLh7
- **Liverpool:** https://maps.app.goo.gl/GQjJPAPZCE6DUkt9A

---

## 🌤️ Clima

El widget de clima usa la API Open-Meteo (gratuita, sin API key).
Muestra el promedio histórico de la región de Veracruz para el 5 de Octubre.

---

## 🚀 Cómo Abrir

### Opción 1: Servidor Local (Recomendado)
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .

# Luego abre: http://localhost:8000
```

### Opción 2: VS Code
- Instala la extensión "Live Server"
- Clic derecho en `index.html` → "Open with Live Server"

### ⚠️ No abrir directamente con `file://` 
Los iframes de Google Maps y algunas APIs requieren un servidor HTTP.

---

## 🎨 Paleta de Colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--wine` | `#7B1C2E` | Color vino principal |
| `--wine-deep` | `#4A0E1A` | Vino oscuro |
| `--gold` | `#C9A84C` | Dorado principal |
| `--gold-light` | `#E8C96A` | Dorado claro |
| `--white` | `#FFFFFF` | Blanco |
| `--cream` | `#FAF6F0` | Crema suave |
| `--dark` | `#130609` | Fondo oscuro |

---

## 🔤 Tipografías Utilizadas

| Fuente | Uso |
|--------|-----|
| **Cinzel Decorative** | Nombres de los novios, títulos principales |
| **Cormorant Garamond** | Subtítulos, textos largos, cuerpo |
| **Great Vibes** | Logo, elementos script decorativos |
| **Cinzel** | Tags, etiquetas, navegación |
| **Lato** | Texto general, párrafos |

---

## ✨ Características

- ✅ Diseño responsive (móvil, tablet, laptop)
- ✅ Animación 3D corazón de partículas (Three.js)
- ✅ Cuenta regresiva en tiempo real
- ✅ Reproductor de música flotante
- ✅ QR Code para WhatsApp
- ✅ Mapas interactivos de Google Maps
- ✅ Widget de clima (API Open-Meteo)
- ✅ Mesa de regalos Liverpool
- ✅ 3 páginas: Inicio, Historia, Itinerario
- ✅ Animaciones de scroll reveal
- ✅ Parallax en fondos
- ✅ Menú hamburguesa en móvil
- ✅ Protocolo completo de boda
- ✅ Timeline de historia de amor
- ✅ Galería de fotos
- ✅ Efectos de brillo dorado

---

**Con todo el amor · Miguel Ángel & Deisy Lizeth · 05·10·2027** 💍
