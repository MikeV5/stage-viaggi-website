import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
//firebase/auth
//https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js
const firebaseConfig = {
    apiKey: "AIzaSyBmQk-cwN4jdLcnlv-2GUke_fmTsG7EjDY",
    authDomain: "stage-viaggi-website.firebaseapp.com",
    databaseURL: "https://stage-viaggi-website-default-rtdb.firebaseio.com",
    projectId: "stage-viaggi-website",
    storageBucket: "stage-viaggi-website.appspot.com",
    messagingSenderId: "18281769377",
    appId: "1:18281769377:web:447864ce20a01aaff843e0"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
//const createNewUser = createUserWithEmailAndPassword(app);
//const login = signInWithEmailAndPassword(app);

export { db, auth };