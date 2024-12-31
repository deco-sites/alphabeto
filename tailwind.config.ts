import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    theme: {
      container: {
        center: true,
        screens: {
          desktop: "95rem",
        },
        padding: {
          desktop: "2.5rem",
          mobile: "1.25rem",
        },
      },
    },

    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
        "scroll-right": "scroll-right 5s linear infinite",
        "scroll-left": "scroll-left 5s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      fontFamily: {
        "beccaPerry": ["BeccaPerry", "sans-serif"],
      },
    },

    screens: {
      "mobile": { max: "1023px" },
      // =< @media (max-width: 1023px) { ... }

      "tablet": "680px",
      // => @media (min-width: 680px) { ... }

      "tablet-large": "768px",
      // => @media (min-width: 768px) { ... }

      "desk": "1024px",
      // => @media (min-width: 1024px) { ... }

      "desk-small": { max: "1200px" },
      // =< @media (min-width: 1200px) { ... }

      "max-1330": {
        max: "1330px",
      },
      "max-1240": {
        max: "1240px",
      },
    },
  },
};
