import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";
const firebaseConfig = {
  apiKey: "AIzaSyBDMAPvvCb1MFFWgVb_8GTpQYwMSAR9uBU",
  authDomain: "mimminoah-ee32a.firebaseapp.com",
  databaseURL: "https://mimminoah-ee32a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mimminoah-ee32a",
  storageBucket: "mimminoah-ee32a.firebasestorage.app",
  messagingSenderId: "598999784847",
  appId: "1:598999784847:web:3de2bb39f019deeca27ffa"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Be om push-notis-tillstånd när sidan öppnas
window.onload = function() {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            getToken(messaging, { vapidKey: "DIN_VAPID_KEY" }).then((currentToken) => {
                if (currentToken) {
                    saveTokenToDatabase(currentToken);
                }
            }).catch((err) => {
                console.error("Fel vid hämtning av token:", err);
            });
        }
    });
};

// Skicka token till backend
function saveTokenToDatabase(token) {
    fetch("https://din-backend-url.onrender.com/saveToken", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
    });
}

// Hantera notiser medan appen är öppen
onMessage(messaging, (payload) => {
    alert(payload.notification.title + "\n" + payload.notification.body);
});

// Hantera formulär för att skicka notis
document.getElementById("notificationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;

    fetch("https://din-backend-url.onrender.com/sendNotification", {
        method: "POST",
        body: JSON.stringify({ title, body: message }),
        headers: { "Content-Type": "application/json" }
    });
});