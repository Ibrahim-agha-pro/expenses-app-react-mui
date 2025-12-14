const getDesigTokens = (myMode) => ({
  palette: {
    mode: myMode,

    ...(myMode === "light"
      ? // light mode
        {
          grey: { main: "rgba(0, 0, 0, 0.15)", contrastText: "#fff" },
        }
      : // dark mode
        {
          grey: {
            main: "rgba(255, 255, 255, 0.1)",
            contrastText: "#000",
          },
        }),
  },
});

export default getDesigTokens;
