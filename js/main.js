import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ================= Firebase Config =================
const firebaseConfig = {
  apiKey: "AIzaSyDtSPMa7NPJ-pJ1-zHI61oWcZzr9r4G1GA",
  authDomain: "student-teacher-booking-e04ff.firebaseapp.com",
  projectId: "student-teacher-booking-e04ff",
  storageBucket: "student-teacher-booking-e04ff.firebasestorage.app",
  messagingSenderId: "660361978879",
  appId: "1:660361978879:web:390309567966c819927dca",
  measurementId: "G-SQLK0ECGZN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= DOM Elements =================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const registerResult = document.getElementById("register-result");
  const loginResult = document.getElementById("login-result");
  const logoutBtn = document.getElementById("logout-btn");

  // ========== REGISTER ==========
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const department = e.target.department.value || "N/A";

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        name,
        email,
        department,
      });

      registerResult.textContent = "✅ Registered successfully!";
      registerResult.style.color = "green";
      e.target.reset();
    } catch (err) {
      registerResult.textContent = "❌ " + err.message;
      registerResult.style.color = "red";
    }
  });

  // ========== LOGIN ==========
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginResult.textContent = "✅ Login successful! Redirecting...";
      loginResult.style.color = "green";
      setTimeout(() => {
        window.location.href = "student.html"; // You can later switch this to dynamic redirect
      }, 1200);
    } catch (err) {
      loginResult.textContent = "❌ " + err.message;
      loginResult.style.color = "red";
    }
  });

  // ========== LOGOUT ==========
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.reload();
  });

  // ========== AUTH STATE CHANGE ==========
  onAuthStateChanged(auth, (user) => {
    if (user) {
      logoutBtn.style.display = "block";
    } else {
      logoutBtn.style.display = "none";
    }
  });
});
