/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      black: "#000",
      darker: "#0D0E10;",
      dark: "#131417;",
      "dark-gray": "#313131",
      gray: "#BDBDBD",
      "gray-500": "#4B4B4B",
      "gray-400": "#2E2E2E",
      "gray-300": "#7C7C7C",
      "gray-200": "#E4D9D9",
      "gray-100": "#686868",
      "dark-blue": "#0B387C",
      blue: "#4A8DBD",
      "blue-200": "#5AA2D6",
      "light-blue": "#77A9F4",
      green: "#0FB063",
      "green-200": "#4CAF50",
      "white-200": "#F9F9F9",
      white: "#FFFFFF",
    },
    fontFamily: {
      poppins: ["Poppins"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
