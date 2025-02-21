/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0accd6",

          secondary: "#db95f4",

          accent: "#fcd34d",

          neutral: "#1B1726",

          "base-100": "#FCFCFD",

          info: "#5EA1E8",

          success: "#4DDB86",

          warning: "#C26A05",

          error: "#FC274E",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
