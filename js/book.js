import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  collection,
  getDocs,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const teacherSelect = document.getElementById("teacher");
const bookingForm = document.getElementById("booking-form");

// ---------------------------------------------------
// WAIT UNTIL AUTH IS READY BEFORE LOADING TEACHERS
// ---------------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
    loadTeachers();
  } else {
    console.log("User not logged in");
    teacherSelect.innerHTML = `<option disabled selected>Login required</option>`;
  }
});

// ---------------------------------------------------
// LOAD TEACHERS FROM FIRESTORE
// ---------------------------------------------------
async function loadTeachers() {
  teacherSelect.innerHTML = `<option disabled selected>Loading...</option>`;

  try {
    const teacherRef = collection(db, "teachers");
    const snapshot = await getDocs(teacherRef);

    teacherSelect.innerHTML = ""; // clear first

    if (snapshot.empty) {
      teacherSelect.innerHTML =
        `<option disabled selected>No teachers available</option>`;
      return;
    }

    snapshot.forEach((doc) => {
      const t = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${t.name} (${t.department})`;
      teacherSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading teachers:", err);
    teacherSelect.innerHTML =
      `<option disabled selected>Error loading teachers</option>`;
  }
}

// ---------------------------------------------------
// BOOKING FORM SUBMISSION
// ---------------------------------------------------
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  const teacherId = teacherSelect.value;
  const date = document.getElementById("date").value;
  const reason = document.getElementById("reason").value;

  try {
    await addDoc(collection(db, "bookings"), {
      studentId: user.uid,
      teacherId,
      date,
      reason,
      status: "Pending",
      createdAt: Timestamp.now()
    });

    alert("Booking Successful!");
    bookingForm.reset();

  } catch (err) {
    console.error("Error booking:", err);
    alert("Failed to book. Check console.");
  }
});
