import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// DOM Elements
const teacherForm = document.getElementById("teacher-form");
const teacherResult = document.getElementById("teacher-result");
const teacherList = document.getElementById("teacher-list");
const bookingList = document.getElementById("admin-booking-list");
const logoutBtn = document.getElementById("logout-btn");

// ================= ADD TEACHER =================
teacherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = teacherForm.name.value.trim();
  const email = teacherForm.email.value.trim();  // Make sure form has this field
  const department = teacherForm.department.value.trim() || "N/A";
  const subject = teacherForm.subject.value.trim() || "N/A";

  if (!name || !email) {
    teacherResult.innerText = "❌ Please enter teacher name and email!";
    return;
  }

  try {
    // Add to 'teachers' collection
    await addDoc(collection(db, "teachers"), {
      name,
      email,
      department,
      subject,
      createdAt: new Date().toISOString()
    });

    // Add to 'users' collection for login and dropdown
    await addDoc(collection(db, "users"), {
      name,
      email,
      department,
      subject,
      role: "teacher",
      createdAt: new Date().toISOString()
    });

    teacherResult.innerText = "✅ Teacher added successfully!";
    teacherForm.reset();
    loadTeachers();
  } catch (err) {
    teacherResult.innerText = "❌ " + err.message;
  }
});

// ================= LOAD TEACHERS =================
async function loadTeachers() {
  teacherList.innerHTML = "";

  const snap = await getDocs(collection(db, "teachers"));

  snap.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.classList.add("teacher-item");

    div.innerHTML = `
      <span>${data.name}</span>
      <span>${data.department}</span>
      <span>${data.subject}</span>
      <button class="del" data-id="${docSnap.id}">Delete</button>
    `;

    teacherList.appendChild(div);
  });

  // Delete Listener
  document.querySelectorAll(".del").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "teachers", btn.dataset.id));
      loadTeachers();
    });
  });
}

// ================= LOAD BOOKINGS =================
async function loadBookings() {
  bookingList.innerHTML = "";

  const snap = await getDocs(collection(db, "bookings"));

  snap.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.classList.add("booking-item");

    div.innerHTML = `
      <p><strong>${data.studentName}</strong> → ${data.subject}</p>
      <small><strong>Email:</strong> ${data.studentEmail}</small>
      <small><strong>Message:</strong> ${data.message}</small>
      <small><strong>Status:</strong> ${data.status || "Pending"}</small>

      <button class="accept-btn" data-id="${docSnap.id}">Accept</button>
      <button class="reject-btn" data-id="${docSnap.id}">Reject</button>
    `;

    bookingList.appendChild(div);
  });

  // Accept
  document.querySelectorAll(".accept-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Accepted"));
  });

  // Reject
  document.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Rejected"));
  });
}

// ================= UPDATE STATUS =================
async function updateStatus(id, status) {
  await updateDoc(doc(db, "bookings", id), { status });
  loadBookings();
}

// ================= AUTH CHECK =================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login as admin!");
    window.location.href = "index.html";
  } else {
    loadTeachers();
    loadBookings();
  }
});

// ================= LOGOUT =================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
