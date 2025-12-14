import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEaXXW0xFi7BE4ZsNUfc2m8INaVa5V6G0",
  authDomain: "expense-manager-app-57ce1.firebaseapp.com",
  projectId: "expense-manager-app-57ce1",
  storageBucket: "expense-manager-app-57ce1.firebasestorage.app",
  messagingSenderId: "678990260627",
  appId: "1:678990260627:web:7d82220af1bd3b605da066",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
