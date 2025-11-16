import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const bookingList = document.getElementById("booking-list");
const teacherInfo = document.getElementById("teacher-info");
const logoutBtn = document.getElementById("logout-btn");

// Check teacher login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  teacherInfo.textContent = `Logged in as ${user.email}`;
  loadBookings(user.email);
});

// Load bookings for this teacher
async function loadBookings(email) {
  bookingList.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const q = query(collection(db, "bookings"), where("teacherEmail", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      bookingList.innerHTML = "<tr><td colspan='6'>No bookings yet.</td></tr>";
      return;
    }

    bookingList.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Student">${data.studentName}</td>
        <td data-label="Email">${data.studentEmail}</td>
        <td data-label="Subject">${data.subject}</td>
        <td data-label="Message">${data.message}</td>
        <td data-label="Status">${data.status || "Pending"}</td>
        <td data-label="Actions">
          <button data-id="${docSnap.id}" class="mark-done">Mark Done</button>
        </td>
      `;
      bookingList.appendChild(row);
    });

    document.querySelectorAll(".mark-done").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const bookingId = e.target.dataset.id;
        const ref = doc(db, "bookings", bookingId);
        await updateDoc(ref, { status: "Completed" });
        alert("✅ Booking marked as completed!");
        loadBookings(email);
      });
    });
  } catch (err) {
    console.error(err);
    bookingList.innerHTML = "<tr><td colspan='6'>Error loading bookings.</td></tr>";
  }
}

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
