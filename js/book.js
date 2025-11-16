import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// DOM elements
const teacherSelect = document.getElementById("teacher-select");
const bookingForm = document.getElementById("booking-form");

// Wait for auth before loading teachers
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("User not logged in");
    return;
  }

  console.log("Logged in as:", user.email);

  loadTeachers(); // call after auth
});

// Load teachers from Firestore
async function loadTeachers() {
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
}


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
  const date = bookingForm.date.value;
  const reason = bookingForm.reason.value;

  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in!");
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      teacherId,
      date,
      reason,
      studentId: user.uid,
      studentEmail: user.email,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    alert("Booking submitted!");
    bookingForm.reset();
  } catch (error) {
    console.error(error);
    alert("Error submitting booking");
  }
});
