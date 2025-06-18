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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
          vibrant: "#007BFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          action: "#6C757D",
        },
        status: {
          pending: {
            DEFAULT: "hsl(48, 95%, 50%)", // yellow-500
            foreground: "hsl(48, 95%, 10%)",
          },
          confirmed: {
            DEFAULT: "hsl(217, 100%, 50%)", // blue-500
            foreground: "hsl(217, 100%, 95%)",
          },
          preparing: {
            DEFAULT: "hsl(39, 100%, 50%)", // orange-500
            foreground: "hsl(39, 100%, 10%)",
          },
          out_for_delivery: {
            DEFAULT: "hsl(271, 76%, 53%)", // purple-500
            foreground: "hsl(271, 76%, 95%)",
          },
          delivered: {
            DEFAULT: "hsl(145, 63%, 42%)", // green-600
            foreground: "hsl(145, 63%, 95%)",
          },
          completed: {
            DEFAULT: "hsl(145, 73%, 32%)", // green-700
            foreground: "hsl(145, 73%, 95%)",
          },
          cancelled: {
            DEFAULT: "hsl(354, 70%, 54%)", // red-600
            foreground: "hsl(354, 70%, 95%)",
          },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        caption: ["0.875rem", { lineHeight: "1.25rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
