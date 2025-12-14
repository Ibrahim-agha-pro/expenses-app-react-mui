import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import MyAppAndDrewer from "./components/MyAppAndDrewer";
import { Create } from "./components/Create";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import getDesigTokens from "./style/myTheme";
import { SnackbarProvider } from "notistack";
import { Profil } from "./components/Profile";
import { Auth } from "./components/Auth";

import UserProvider from "./contexts/userContext";
import SimpleDialogDemo from "./components/Dialoge";

function App() {
  const [myMode, setMyMode] = useState(() => {
    let saved = localStorage.getItem("mode");
    return saved ? saved : "light";
  });
  const theme = useMemo(() => createTheme(getDesigTokens(myMode)), [myMode]);

  useEffect(() => {
    localStorage.setItem("mode", myMode);
  }, [myMode]);

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <Routes>
            <Route
              path="/"
              element={<MyAppAndDrewer myMode={myMode} setMyMode={setMyMode} />}
            >
              <Route path="home" element={<Home />} />
              <Route path="create" element={<Create />} />
              <Route path="profile" element={<Profil />} />
              <Route path="auth" element={<Auth />} />
              <Route path="demo" element={<SimpleDialogDemo />} />
            </Route>
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
