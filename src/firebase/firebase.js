import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBk-8WAR1Xpg6Wdz7tywqP8Mw-PDerztnM",
  authDomain: "viewora-notification.firebaseapp.com",
  projectId: "viewora-notification",
  storageBucket: "viewora-notification.firebasestorage.app",
  messagingSenderId: "439946140444",
  appId: "1:439946140444:web:cb659395952469092338d9",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
