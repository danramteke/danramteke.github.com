module.exports = {
  plugins: [require("@tailwindcss/typography")],
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}",
  ],
  theme: {
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
    },
    extend: {
      colors: {
        tomato: "#ff0000",
        "dr-purp-drk": "#292568",
        "dr-blue": {
          1: "#0A2744",
          a: "#1756a9",
          2: "#1D4061",
          3: "#5A7997",
          4: "#89A1B8",
        },
        "dr-gray": {
          1: "#202020",
          5: "#777777",
          8: "#dddddd",
          9: "#eeeeee",
        },
      },
    },
  },
};
