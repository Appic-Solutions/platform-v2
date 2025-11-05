import type { Config } from 'tailwindcss';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [scrollbar({ nocompatible: true })],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /* Colors */
      colors: {
        'primary': 'rgb(var(--primary))',
        'secondary': 'rgb(var(--secondary))',
        'tertiary': 'rgb(var(--tertiary))',
        'active': 'rgb(var(--active))',
        'success': 'rgb(var(--success))',
        'fail': 'rgb(var(--fail))',
        'muted': 'rgb(var(--muted))',
        'box-border': 'var(--box-border)',
        'card-background': 'var(--card-background)',
      },
      /* Background */
      backgroundImage: {
        'input-fields': 'var(--input-fields)',
        'primary-buttons': 'var(--primary-buttons)',
        'primary-buttons-hover': 'var(--primary-buttons-hover)',
        'highlighed-components': 'var(--highlighed-components)',
        'background-dark': 'var(--background-dark)',
        'shapes-background': 'var(--shapes-background)',
        'card-background': 'var(--card-background)',
        'box-background-secondary': 'var(--box-background-secondary)',
        'box-border-gradient': 'var(--box-border-gradient)',
        'box-background': 'var(--box-background)',
        'highlighted-card': 'var(--highlighted-card)',
        'input-fields-hover': 'var(--input-fields-hover)',
      },
      /* Box Shadow */
      boxShadow: {
        'appic-shadow': '4px 4px 0px 0px #00000040',
      },

      /* Screen Sizes */
      screens: {
        xs: '480px',
      },

      /* Keyframes */
      keyframes: {
        // Panel
        'slideInFromRight': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slideInFromLeft': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slideInFromTop': {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slideInFromTopWithHeight': {
          '0%': {
            transform: 'translateY(-10%)',
            opacity: '0',
            maxHeight: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
            maxHeight: '700px',
          },
        },
        'border-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fadeIn': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },

        // Landing
        'scroll-button-effect': {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'border-rotate': {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'border-move-rotate': {
          '0%': { 'offset-distance': '0%' },
          '100%': { 'offset-distance': '100%' },
        },
        'text-stroke': {
          '0%': {
            fill: 'rgba(72, 138, 20, 0)',
            stroke: 'rgba(54, 95, 160, 1)',
            strokeDashoffset: '25%',
            strokeDasharray: '0 50%',
            strokeWidth: '2',
          },
          '70%': {
            fill: 'rgba(72, 138, 20, 0)',
            stroke: 'rgba(54, 95, 160, 1)',
          },
          '80%': {
            fill: 'rgba(72, 138, 20, 0)',
            stroke: 'rgba(54, 95, 160, 1)',
            strokeWidth: '3',
          },
          '100%': {
            fill: '#1C68F8',
            stroke: 'rgba(54, 95, 160, 0)',
            strokeDashoffset: '-25%',
            strokeDasharray: '50% 0',
            strokeWidth: '3',
          },
        },
        'scroll': {
          '100%': {
            transform: 'translate(calc(-50% - 2rem))',
          },
        },
      },

      /* Animation */
      animation: {
        // Panel
        'slide-in-from-right': 'slideInFromRight 0.5s ease-in-out',
        'slide-in-from-left': 'slideInFromLeft 0.5s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out 0.1s forwards',
        'slide-in-from-top': 'slideInFromTop 0.2s ease-out',
        'slide-in-with-height': 'slideInFromTopWithHeight 0.3s ease-out forwards',
        'border-spin': 'border-spin 2s linear infinite',
        'fade': 'fadeIn .5s ease-in-out',

        // Landing
        'border-rotate': 'border-rotate 5s linear forwards infinite',
        'infinite-scroll': 'scroll 20s linear infinite',
        'text-stroke': 'text-stroke 5s both alternate',
        'border-move-rotate': 'border-move-rotate 12s linear infinite',
        'scroll-button-effect-animate': 'scroll-button-effect 2.5s infinite',
      },
    },
  },
};
export default config;
