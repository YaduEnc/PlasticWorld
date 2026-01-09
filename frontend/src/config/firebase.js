import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCEgFOzM8VaKURBTWAerFwgSfmMoDOYISQ",
    authDomain: "platicworld-f671a.firebaseapp.com",
    projectId: "platicworld-f671a",
    storageBucket: "platicworld-f671a.firebasestorage.app",
    messagingSenderId: "869365225242",
    appId: "1:869365225242:web:57a24b1f69c39248193ea3",
    measurementId: "G-HLZTGK7Z22"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app
