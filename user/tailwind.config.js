/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))", 
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Paleta Específica 5 Colores Exactos
        'pink': {
          50: '#fefafc',   // Muy claro
          100: '#fdf5f8',  // Claro
          200: '#fbeaf0',  // Medio claro
          300: '#f7d5e4',  // Medio
          400: '#f2c5d9',  // Principal - #f2c5d9
          500: '#f2c5d9',  // Rosa principal
          600: '#e3a8c4',  // Más oscuro
          700: '#d18baf',  // Oscuro
          800: '#b56e94',  // Muy oscuro
          900: '#8f5576',  // Ultra oscuro
        },
        'red': {
          50: '#fef5f3',   // Muy claro
          100: '#fce8e3',  // Claro
          200: '#f8cfc5',  // Medio claro
          300: '#f2a898',  // Medio
          400: '#e8715c',  // Claro
          500: '#e25d39',  // Principal - #e25d39
          600: '#d44322',  // Más oscuro
          700: '#b23419',  // Oscuro
          800: '#932a17',  // Muy oscuro
          900: '#7a2619',  // Ultra oscuro
        },
        'cream': {
          50: '#fefcfa',   // Muy claro
          100: '#fdf9f6',  // Claro
          200: '#faf4ed',  // Medio claro
          300: '#f6ede1',  // Medio
          400: '#f4efe9',  // Principal - #f4efe9
          500: '#f4efe9',  // Cremita fondo
          600: '#e8d8c8',  // Más oscuro
          700: '#dcc1a7',  // Oscuro
          800: '#c5a082',  // Muy oscuro
          900: '#a68366',  // Ultra oscuro
        },
        'orange': {
          50: '#fef9f4',   // Muy claro
          100: '#fef2e7',  // Claro
          200: '#fce2c4',  // Medio claro
          300: '#f9cc96',  // Medio
          400: '#f5b066',  // Claro
          500: '#ea9651',  // Principal - #ea9651
          600: '#d97b3a',  // Más oscuro
          700: '#b66029',  // Oscuro
          800: '#944b24',  // Muy oscuro
          900: '#783f23',  // Ultra oscuro
        },
        'dark': {
          50: '#f6f3f1',   // Muy claro
          100: '#ebe4df',  // Claro
          200: '#d5c8be',  // Medio claro
          300: '#bba596',  // Medio
          400: '#a28471',  // Claro
          500: '#8f6d58',  // Medio
          600: '#75574a',  // Oscuro
          700: '#5e453b',  // Más oscuro
          800: '#4e3831',  // Muy oscuro
          900: '#3b291c',  // Principal - #3b291c
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
