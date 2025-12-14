import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setUserExpenses([]);
        navigate("/auth");
        return;
      }

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCurrentUser({ uid: snap.id, ...snap.data() });
        setUserExpenses(snap.data().expenses || []);
      }
    });

    return () => unsub();
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ currentUser, userExpenses, setUserExpenses }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
