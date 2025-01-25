import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY_FUYPBrKNoBnI9uAJIwoUqPbBDlVNgo",
  authDomain: "finalproject-2dd4e.firebaseapp.com",
  projectId: "finalproject-2dd4e",
  storageBucket: "finalproject-2dd4e.firebasestorage.app",
  messagingSenderId: "694146716029",
  appId: "1:694146716029:web:16ea2237660ce782aa7c14",
  measurementId: "G-9Y54L365NQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
