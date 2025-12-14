import styled from "@emotion/styled";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { purple } from "@mui/material/colors";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

export const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const { currentUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleAddItem() {
    if (titleInput === "" || priceInput === "") {
      enqueueSnackbar("Please fill all inputs", { variant: "warning" });
      return;
    }
    setLoading(true);
    if (currentUser) {
      try {
        const docRef = doc(db, "users", currentUser.uid);

        await updateDoc(docRef, {
          expenses: arrayUnion({
            title: titleInput,
            price: Number(priceInput),
            eId: Date.now(),
          }),
        });

        enqueueSnackbar("Item added successfully", { variant: "success" });
        navigate("/home");
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Something went wrong while adding", {
          variant: "error",
        });
      } finally {
        setLoading(true);
      }
    } else {
      navigate("/auth");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddItem();
      }}
    >
      <TextField
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        fullWidth
        label="Transaction Title"
        sx={{
          display: "block",
          mb: "15px",
          width: {
            xs: "280px",
            md: "370px",
          },
        }}
        variant="filled"
        InputProps={{
          startAdornment: <InputAdornment position="start">👉</InputAdornment>,
        }}
      />
      <TextField
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
        label="Amount"
        fullWidth
        sx={{
          display: "block",
          width: {
            xs: "280px",
            md: "370px",
          },
        }}
        variant="filled"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />

      <ColorButton
        loading={loading}
        loadingPosition="start"
        type="submit"
        sx={{ mt: "22px" }}
      >
        Submit <ChevronRightIcon sx={{ fontSize: "20px" }} />
      </ColorButton>
    </Box>
  );
};
