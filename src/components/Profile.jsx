import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));
export const Profil = () => {
  const [loading, setLoading] = useState(false);

  const [userImage, setUserImage] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const { currentUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  if (!currentUser) return;
  async function handleSubmit() {
    const dataForm = new FormData();

    dataForm.append("file", userImage);
    dataForm.append("upload_preset", "wzjznodt");
    dataForm.append("folder", "expenses-users");
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgmbrs902/image/upload",
        {
          method: "POST",
          body: dataForm,
        }
      );

      const data = await res.json();
      const imageUrl = data.secure_url;

      await updateDoc(doc(db, "users", currentUser.uid), {
        userImage: imageUrl,
        userName: nameInput,
      });

      enqueueSnackbar("update profile done successfully", {
        variant: "success",
      });
      navigate("/home");
    } catch (error) {
      enqueueSnackbar("Please fill all inputs", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        width: {
          xs: "280px",
          md: "370px",
        },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">Complete your account</Typography>
      <TextField
        variant="filled"
        label="Your name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />

      <Button
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Shoose your photo
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => setUserImage(e.target.files[0])}
          multiple
        />
      </Button>

      <Button
        size="small"
        color="secondary"
        onClick={handleSubmit}
        loading={loading}
        loadingPosition="start"
        variant="contained"
      >
        Submit
      </Button>
    </Box>
  );
};
