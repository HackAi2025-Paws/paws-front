# 🐾 Paws - Pet Care Assistant

Una Progressive Web App (PWA) para dueños de mascotas que ayuda a mejorar la calidad de vida de los animales.

## ✨ Funcionalidades

### MVP Implementado

- ✅ **Autenticación simple**: Login con demo rápido
- ✅ **Dashboard de mascotas**: Lista de mascotas con fotos, nombres, razas y edad
- ✅ **Perfil de mascota**: Datos detallados + notas + historial + próximos controles
- ✅ **Sistema de recordatorios**: Calendario con alertas de vacunas y consultas
- ✅ **FAQ interactivo**: Preguntas frecuentes categorizadas y buscables
- ✅ **Chat veterinario**: Chat simulado estilo WhatsApp con respuestas automáticas
- ✅ **PWA instalable**: Manifest.json y service workers configurados

### Tecnologías Utilizadas

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Estado**: Redux Toolkit
- **Routing**: React Router v6
- **PWA**: Service Worker + Web App Manifest
- **Iconos**: Lucide React

## 🚀 Instalación y Uso

### Prerequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd paws-front

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview
```

### Acceso Rápido (Demo)

1. Abrir la aplicación en: `http://localhost:5173`
2. En la pantalla de login, hacer clic en **"Acceso rápido (Demo)"**
3. ¡Explora todas las funcionalidades!

## 📱 Estructura de la App

### Rutas Principales

- `/login` - Autenticación
- `/dashboard` - Inicio con lista de mascotas y accesos rápidos
- `/pet/:id` - Perfil detallado de mascota
- `/reminders` - Gestión de recordatorios y calendario
- `/faq` - Preguntas frecuentes categorizadas
- `/chat` - Chat simulado con veterinario
- `/profile` - Perfil de usuario y configuración

### Componentes Principales

#### `PetCard` - Tarjeta de mascota
- Muestra foto, nombre, raza, edad y peso
- Indicadores de eventos próximos
- Navegación al perfil detallado

#### `PetProfile` - Detalle de mascota
- Información completa de la mascota
- Historial de vacunas y consultas
- Próximos eventos programados
- Notas personalizadas

#### `ReminderList` - Lista de recordatorios
- Recordatorios por tipo (vacuna, consulta, medicación)
- Estados: pendiente, completado, vencido
- Filtros por estado y mascota

#### `ChatMock` - Chat simulado
- Interfaz estilo WhatsApp
- Respuestas automáticas del "veterinario"
- Sugerencias rápidas de mensajes

## 🎨 Diseño y UX

### Principios de Diseño

- **Mobile-first**: Optimizado para dispositivos móviles
- **Navegación intuitiva**: Bottom navigation familiar
- **Feedback visual**: Estados claros para todas las acciones
- **Accesibilidad**: Colores contrastados y textos legibles

### Paleta de Colores

- **Primario**: Azul (`#3b82f6`) - Confianza y profesionalismo
- **Secundario**: Verde - Salud y bienestar
- **Alertas**: Naranja/Rojo - Urgencia y atención
- **Neutros**: Grises - Contenido y estructura

## 💾 Datos Mock

La aplicación incluye datos de ejemplo:

- **3 mascotas**: Max (Golden Retriever), Luna (Gato Persa), Rocky (Bulldog Francés)
- **Recordatorios**: Vacunas, consultas y medicaciones
- **FAQ**: 6 preguntas frecuentes categorizadas
- **Chat**: Conversación simulada con Dr. Martinez

## 🔧 Configuración PWA

### Manifest.json
```json
{
  "name": "Paws - Pet Care Assistant",
  "short_name": "Paws",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### Service Worker
- Cache de recursos estáticos
- Funcionalidad offline básica
- Actualizaciones automáticas

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🚀 Próximos Pasos

### Funcionalidades Futuras

- [ ] **Backend real**: API REST para datos persistentes
- [ ] **Push notifications**: Recordatorios nativos
- [ ] **Cámara**: Captura de fotos de mascotas
- [ ] **Geolocalización**: Veterinarias cercanas
- [ ] **Calendario**: Vista de calendario interactiva
- [ ] **Reportes**: Estadísticas de salud

### Mejoras Técnicas

- [ ] **Testing**: Unit tests con Jest/Vitest
- [ ] **E2E Testing**: Playwright o Cypress
- [ ] **Performance**: Lazy loading y optimización
- [ ] **Offline**: Mejor soporte offline con IndexedDB

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

**Desarrollado con ❤️ para el bienestar animal** 🐕🐱