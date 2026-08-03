import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyCikznfdCHbReOvRjbdz0KQUShvKppsPC8",
    authDomain: "absensi-web-89cd6.firebaseapp.com",
    projectId: "absensi-web-89cd6",
    storageBucket: "absensi-web-89cd6.firebasestorage.app",
    messagingSenderId: "377355105069",
    appId: "1:377355105069:web:e0511c3ee92d03749a59a4",
    measurementId: "G-WJ6EEDXE2Z"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
