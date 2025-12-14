import { Typography, IconButton, Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useState } from "react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useSnackbar } from "notistack";
import { UserContext } from "../contexts/userContext";
import EditIcon from "@mui/icons-material/Edit";
import AlertDialog from "./AlertDialog";
import FormDialog from "./FormDialog";

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [openDeleteDialog, setOpenDeleteDialg] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, userExpenses, setUserExpenses } =
    useContext(UserContext);

  if (!currentUser) return;

  async function handleDelete({ eId, title, price }) {
    setLoading(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, {
        expenses: arrayRemove({
          eId,
          title,
          price,
        }),
      });

      setUserExpenses((prev) => prev.filter((e) => e.eId !== eId));

      setOpenDeleteDialg(false);
      setSelectedItem({});
      enqueueSnackbar("deleting done successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("something wrong happend with deleting", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(updatedExpense) {
    setLoading(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, {
        expenses: userExpenses.map((e) =>
          e.eId === updatedExpense.eId ? updatedExpense : e
        ),
      });

      setUserExpenses((prev) =>
        prev.map((e) => (e.eId === updatedExpense.eId ? updatedExpense : e))
      );

      enqueueSnackbar("Updated successfully", { variant: "success" });
      setOpenEditDialog(false);
      setSelectedItem(null);
    } catch (error) {
      enqueueSnackbar("Error while updating", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }
  const dataList = userExpenses.map((e, i) => (
    <Paper
      key={i}
      sx={{
        position: "relative",
        display: "flex",
        width: {
          xs: "280px",
          md: "370px",
        },
        flexDirection: "column",
        mb: "20px",
      }}
    >
      {" "}
      <Box sx={{ display: "flex ", justifyContent: "flex-end", mb: "5px" }}>
        <IconButton
          onClick={() => {
            setOpenEditDialog(true);
            setSelectedItem(e);
          }}
        >
          <EditIcon sx={{ fontSize: "14px" }} />
        </IconButton>

        <IconButton
          onClick={() => {
            setOpenDeleteDialg(true);
            setSelectedItem(e);
          }}
        >
          <CloseIcon sx={{ fontSize: "14px" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: "15px",
          pb: "5px",
        }}
      >
        <Typography variant="h6">{e.title.toUpperCase()}</Typography>
        <Typography variant="h6" sx={{ opacity: "0.7" }}>
          ${e.price}
        </Typography>
      </Box>
    </Paper>
  ));

  let total = userExpenses.reduce((acc, cur) => acc + Number(cur.price), 0);

  return (
    <Box>
      {dataList}
      <Typography variant="h6">Total : {total} $</Typography>
      {openDeleteDialog && (
        <AlertDialog
          title={"Warning"}
          content={`Your are going to delete ${selectedItem.title}   !`}
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialg(false);
            setSelectedItem(null);
          }}
          onConfirm={() => {
            handleDelete({
              eId: selectedItem.eId,
              title: selectedItem.title,
              price: selectedItem.price,
            });
          }}
          loading={loading}
        />
      )}

      {openEditDialog && (
        <FormDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          expense={selectedItem}
          title={"Edit the Expense"}
          onSave={handleEdit}
          loading={loading}
        />
      )}
    </Box>
  );
};
