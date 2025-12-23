/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./index.html",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF5023',
					hover: '#E6411C',
					light: '#FFF0EC',
				},
				secondary: {
					DEFAULT: '#682826',
					light: '#8A3C3A',
				},
				surface: {
					DEFAULT: '#FFFFFF',
					background: '#F5F9FD',
					muted: '#F0F4F8',
				},
				gray: {
					DEFAULT: '#6B7280',
					light: '#9CA3AF',
					dark: '#1F2937',
				},
				success: '#12B76A',
				warning: '#F79009',
				error: '#F04438',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			boxShadow: {
				card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
			},
			borderRadius: {
				DEFAULT: '0.375rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
			}
		},
	},
	plugins: [],
}
