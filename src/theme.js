import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      ".scroll-animation": {
        animation: "scroll 10s linear infinite",
      },
      "@keyframes scroll": {
        "0%": { transform: "translateY(0)" },
        "100%": { transform: "translateY(-100%)" },
      },
    },
  },
});

export default theme;
