const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				vibrant: '#007BFF'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				action: '#6C757D'
  			},
  			status: {
  				pending: {
  					DEFAULT: 'hsl(var(--status-pending))',
  					foreground: 'hsl(var(--status-pending-foreground))'
  				},
  				confirmed: {
  					DEFAULT: 'hsl(var(--status-confirmed))',
  					foreground: 'hsl(var(--status-confirmed-foreground))'
  				},
  				preparing: {
  					DEFAULT: 'hsl(var(--status-preparing))',
  					foreground: 'hsl(var(--status-preparing-foreground))'
  				},
  				out_for_delivery: {
  					DEFAULT: 'hsl(var(--status-out_for_delivery))',
  					foreground: 'hsl(var(--status-out_for_delivery-foreground))'
  				},
  				delivered: {
  					DEFAULT: 'hsl(var(--status-delivered))',
  					foreground: 'hsl(var(--status-delivered-foreground))'
  				},
  				completed: {
  					DEFAULT: 'hsl(var(--status-completed))',
  					foreground: 'hsl(var(--status-completed-foreground))'
  				},
  				cancelled: {
  					DEFAULT: 'hsl(var(--status-cancelled))',
  					foreground: 'hsl(var(--status-cancelled-foreground))'
  				}
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			h1: [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem',
  					fontWeight: '700'
  				}
  			],
  			h3: [
  				'1.5rem',
  				{
  					lineHeight: '2rem',
  					fontWeight: '700'
  				}
  			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			caption: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'strong-pulse': {
  				'0%, 100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'scale(1.03)',
  					opacity: '.8'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'strong-pulse': 'strong-pulse 2s ease-in-out infinite'
  		}
  	}
  },
  plugins: [animate, require("tailwindcss-animate")],
};
