# Frontend Project - Next.js

Este proyecto es una aplicación frontend desarrollada utilizando **Next.js**. El objetivo principal es implementar una interfaz moderna y funcional para la gestión de citas médicas.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
medical/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── components/
│   ├── ProgressBar.tsx
│   ├── theme-provider.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/
│   ├── logo.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── services/
│   ├── api.ts
│   ├── mockData.ts
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Principales Archivos y Carpetas

- **`app/`**: Contiene las páginas y layouts de la aplicación.
- **`components/`**: Componentes reutilizables para la interfaz de usuario.
- **`hooks/`**: Hooks personalizados para lógica específica.
- **`lib/`**: Utilidades y funciones auxiliares.
- **`services/`**: Servicios para manejar la lógica de negocio y comunicación con APIs.
- **`styles/`**: Archivos CSS para estilos globales.
- **`public/`**: Archivos estáticos como imágenes.
- **`tailwind.config.ts`**: Configuración de Tailwind CSS.
- **`next.config.mjs`**: Configuración de Next.js.

## Lógica y Funcionamiento

La aplicación implementa un sistema de gestión de citas médicas. A continuación, se describe la lógica principal:

1. **Gestión de Citas**:
   - Las citas se gestionan desde las páginas correspondientes.
   - Los datos de las citas se obtienen utilizando `api.ts`.

2. **Autenticación**:
   - La autenticación se maneja utilizando las páginas y servicios correspondientes.

3. **Estilos**:
   - Los estilos globales están definidos en `app/globals.css`.

## Despliegue

### Entorno de Desarrollo

Para ejecutar el proyecto en un entorno de desarrollo, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```

4. Abre tu navegador en `http://localhost:3000` para ver la aplicación.

### Entorno de Producción

Para desplegar el proyecto en un entorno de producción:

1. Genera los archivos estáticos:
   ```bash
   pnpm run build
   ```

2. Los archivos generados estarán en la carpeta `.next/`. Puedes servir esta carpeta utilizando cualquier servidor web estático, como Nginx o Apache.

3. Configura tu servidor para servir los archivos desde la carpeta `.next/`.

---

Desarrollado por **Camilo Sanz**.
