import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";

export default function FormDialog({
  title,
  open,
  onClose,
  expense,
  onSave,
  loading,
}) {
  const [titleInput, setTitleInput] = useState("");
  const [priceInput, setPriceInput] = useState("");

  useEffect(() => {
    if (expense) {
      setTitleInput(expense.title);
      setPriceInput(expense.price);
    }
  }, [expense]);

  if (!expense) return null;
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label=" Title"
          type="text"
          fullWidth
          variant="standard"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />

        <TextField
          autoFocus
          required
          margin="dense"
          label=" Price"
          type="text"
          fullWidth
          variant="standard"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          size="small"
          color="secondary"
          onClick={() =>
            onSave({ ...expense, title: titleInput, price: priceInput })
          }
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
