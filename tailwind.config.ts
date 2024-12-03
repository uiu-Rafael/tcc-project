import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-to-r': 'linear-gradient(to right, #6FABFA, #14B8A6)',
      },
      colors: {
        color1: '#3E4756',
        color2: '#A1ACBD',
        color3: '#8a8a8a',
        color4: '#373737',
        color5: '#DEDEDE',
        color6: '#A6A6A6',
        color7: '#00DBAD',
        section1: '#EFEFEF',
        section2: '#FAFAFA',
      },
      padding: {
        main: '5rem 1rem',
      },
      margin: {
        main: '20px',
        div: '13px',
        title: '10px',
        max: '30px',
      },
      fontFamily: {
        sans: [
          '"Segoe UI"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      height: {
        input: '40px',
      },
      borderColor: {
        primary: '#A1ACBD',
      },
      fontSize: {
        base: '14px',
        min: '12px',
        max: '18px',
      },
      spacing: {
        container: '1.3rem',
        'container-margin': '20px',
        'container-padding': '5rem 1rem',
        arrow: '10px',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      boxShadow: {
        'top-only':
          '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            danger: {
              DEFAULT: '#d74c4b',
              foreground: '#E4E4E7',
            },
            primary: {
              DEFAULT: '#0081CF',
              foreground: '#E4E4E7',
            },
            secondary: {
              DEFAULT: '#00DBAD',
              foreground: '#E4E4E7',
            },
            success: {
              DEFAULT: '#96EE86',
              foreground: '#3E4756',
            },
            warning: {
              DEFAULT: '#F9F871',
              foreground: '#3E4756',
            },
            focus: '#0081CF',
          },
        },
      },
    }),
  ],
};
export default config;
