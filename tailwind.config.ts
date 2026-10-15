module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        onboardFade: "fadeInOut 2s ease-in-out infinite",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
      backgroundColor: {
        pinky: "#FFC0CB",
      },
      backgroundImage: {
        bgImg: "url(/full_logo.svg)",
      },
    },
  },
  plugins: [],
};
