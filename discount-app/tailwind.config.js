export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#29c1da",
          hover: "#1fafc7",
          light: "#e8f9fc",
        },

        border: "#e5e5e5",

        text: {
          primary: "#444444",
          secondary: "#666666",
        },
      },
    },
  },
};
