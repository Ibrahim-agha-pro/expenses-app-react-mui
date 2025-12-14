import styled from "@emotion/styled";
import { Box, Typography, TextField, Button } from "@mui/material";
import { purple } from "@mui/material/colors";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": { backgroundColor: purple[700] },
}));

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleSubmit() {
    if (!email || !password) {
      enqueueSnackbar("Please fill all fields", { variant: "warning" });
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        enqueueSnackbar("Logged in successfully ✅", { variant: "success" });
        navigate("/home");
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        expenses: [],
        userName: "",
        userImage: "",
      });

      enqueueSnackbar("Account created successfully 🎉", {
        variant: "success",
      });

      navigate("/profile");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }

  return (
    <Box sx={{ width: 320, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">
        {isLogin ? "Sign In" : "Create Account"}
      </Typography>

      <TextField
        type="email"
        variant="filled"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        variant="filled"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ColorButton onClick={handleSubmit}>
        {isLogin ? "Sign In" : "Sign Up"}
      </ColorButton>

      <Button onClick={() => setIsLogin((p) => !p)}>
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </Button>
    </Box>
  );
};
