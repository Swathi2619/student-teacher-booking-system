import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const teacherSelect = document.getElementById("teacherSelect");
const bookingForm = document.getElementById("booking-form");
const bookingResult = document.getElementById("booking-result");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("studentEmail").value = user.email;
    userInfo.textContent = `Logged in as ${user.email}`;
    loadTeachers();
  }
});

async function loadTeachers() {
  teacherSelect.innerHTML = `<option value="">-- Choose a teacher --</option>`;

  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.role === "teacher") {
      const option = document.createElement("option");
      option.value = docSnap.id; // UID
      option.textContent = data.name;
      teacherSelect.appendChild(option);
    }
  });
}

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;
  const teacherId = teacherSelect.value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (!teacherId) {
    bookingResult.textContent = "Please select a teacher.";
    bookingResult.style.color = "red";
    return;
  }

  try {
    const teacherDoc = await getDoc(doc(db, "users", teacherId));
    const teacherEmail = teacherDoc.exists() ? teacherDoc.data().email : "";

    await addDoc(collection(db, "bookings"), {
      studentName,
      studentEmail,
      teacherEmail,
      teacherId,        // ⭐ MOST IMPORTANT FIX
      subject,
      message,
      status: "Pending",
      timestamp: new Date(),
    });

    bookingResult.textContent = "✅ Appointment booked successfully!";
    bookingResult.style.color = "green";
    bookingForm.reset();
  } catch (error) {
    console.error(error);
    bookingResult.textContent = "❌ Failed to book appointment.";
    bookingResult.style.color = "red";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => (window.location.href = "index.html"));
});
