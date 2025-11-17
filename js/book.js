import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// DOM elements
const teacherSelect = document.getElementById("teacherSelect"); // matches your HTML
const bookingForm = document.getElementById("booking-form");

// Wait for auth before loading teachers
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("User not logged in");
    return;
  }

  console.log("Logged in as:", user.email);
  await loadTeachers(); // load teachers after auth
});

// Load teachers from Firestore
async function loadTeachers() {
  try {
    const teacherList = document.getElementById("teacherSelect");

    const querySnapshot = await getDocs(collection(db, "teachers"));
    teacherList.innerHTML = '<option value="">-- Choose a teacher --</option>';

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      teacherList.innerHTML += `
        <option value="${doc.id}">
          ${data.name} — ${data.subject}
        </option>
      `;
    });

    console.log("Teachers loaded");
  } catch (error) {
    console.error("Error loading teachers:", error);
    alert("Cannot load teachers. Permission denied.");
  }
}

// Submit booking
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teacherId = teacherSelect.value;
  const studentName = document.getElementById("studentName").value.trim();
  const studentEmail = document.getElementById("studentEmail").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in!");
    return;
  }

  if (!teacherId) {
    alert("Please select a teacher.");
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      teacherId,
      studentName,
      studentEmail,
      subject,
      message,
      studentId: user.uid,
      status: "Pending",
      createdAt: new Date().toISOString()
    });

    alert("Booking submitted successfully!");
    bookingForm.reset();
  } catch (error) {
    console.error("Error submitting booking:", error);
    alert("Error submitting booking. Please try again.");
  }
});
