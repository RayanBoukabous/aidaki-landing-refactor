import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: 'var(--primary-green)',
                    dark: 'var(--primary-green-dark)',
                    light: 'var(--primary-green-light)',
                },
                secondary: 'var(--secondary-green)',
            },
            fontFamily: {
                'sans': ['var(--font-poppins)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
                'serif': ['var(--font-cairo)', '"Times New Roman"', 'Georgia', 'serif'],
                'poppins': ['var(--font-poppins)', 'sans-serif'],
                'cairo': ['var(--font-cairo)', 'serif'],
            },
            animation: {
                'bounce-gentle': 'bounce-gentle 2s infinite',
                float: 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'bounce-gentle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        // Custom RTL utilities
        function ({ addUtilities }) {
            addUtilities({
                '.rtl': { direction: 'rtl' },
                '.ltr': { direction: 'ltr' },
            });
        },
    ],
};

export default config;
