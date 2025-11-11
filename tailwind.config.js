/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 1. Extendemos los colores con tu paleta
      colors: {
        // Mapeamos tus nombres de CSS a nombres de Tailwind
        'principal': '#1E90FF', // var(--color-principal)
        'secundario': '#39FF14', // var(--color-secundario)
        'texto': '#D3D3D3',     // var(--color-texto)
        'fondo': '#000000',     // var(--color-fondo)
        'fondo-oscuro': '#2c2c2c',  // var(--color-fondo-oscuro)
        'fondo-claro': '#1a1a1a',   // var(--color-fondo-claro)

        // 2. Re-mapeamos los colores que ya usamos (gray e indigo)
        // para que usen tu tema automáticamente
        gray: {
          // bg-gray-900 usará tu fondo-claro
          900: '#1a1a1a', 
          // bg-gray-800 usará tu fondo-oscuro
          800: '#2c2c2c',
          // text-gray-300 (o similar) usará tu color de texto
          300: '#D3D3D3',
        },
        indigo: {
          // bg-indigo-600 (botones) usará tu color principal
          600: '#1E90FF',
          700: '#1c86f0', // Un tono ligeramente más oscuro para el hover
        }
      }
    },
  },
  plugins: [],
}