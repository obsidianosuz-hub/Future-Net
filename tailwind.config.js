/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030008',       // Ultra dark cyberpunk violet background
          cyan: '#00f0ff',     // Bright neon cyan
          purple: '#bd00ff',   // Electric magenta-purple
          emerald: '#00ff66',  // Radioactive neon green
          pink: '#ff007a',     // Laser hot pink
          darkCard: 'rgba(12, 5, 23, 0.65)' // Transparent glass background
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #bd00ff 50%, #ff007a 100%)',
        'cyber-emerald-grad': 'linear-gradient(135deg, #00ff66 0%, #00f0ff 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)'
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.1)',
        'neon-purple': '0 0 15px rgba(189, 0, 255, 0.4), inset 0 0 15px rgba(189, 0, 255, 0.1)',
        'neon-emerald': '0 0 15px rgba(0, 255, 102, 0.4), inset 0 0 15px rgba(0, 255, 102, 0.1)',
        'neon-pink': '0 0 15px rgba(255, 0, 122, 0.4), inset 0 0 15px rgba(255, 0, 122, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        'glass': '12px'
      },
      animation: {
        'neon-pulse': 'neonGlow 2s infinite alternate',
        'cyber-scan': 'scanline 6s linear infinite'
      },
      keyframes: {
        neonGlow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.6)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      }
    },
  },
  plugins: [],
}
