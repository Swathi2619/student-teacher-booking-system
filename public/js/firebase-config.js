import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
   apiKey: "AIzaSyDtSPMa7NPJ-pJ1-zHI61oWcZzr9r4G1GA",
  authDomain: "student-teacher-booking-e04ff.firebaseapp.com",
  projectId: "student-teacher-booking-e04ff",
  storageBucket: "student-teacher-booking-e04ff.firebasestorage.app",
  messagingSenderId: "660361978879",
  appId: "1:660361978879:web:390309567966c819927dca",
  measurementId: "G-SQLK0ECGZN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

