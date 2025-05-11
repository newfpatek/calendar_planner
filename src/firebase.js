// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPRlqcDczA1z-W5VI3kE-8CS7Plu9oxg8",
  authDomain: "calendarplanneri122.firebaseapp.com",
  projectId: "calendarplanneri122",
  storageBucket: "calendarplanneri122.firebasestorage.app",
  messagingSenderId: "293231163975",
  appId: "1:293231163975:web:fe687b476ac795d6c88f62",
  measurementId: "G-Q2N11MQ7BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Функция для сохранения события
export async function saveEvent(userId, event) {
  try {
    const eventRef = doc(db, 'events', userId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      // Если документ не существует, создаем новый
      await setDoc(eventRef, {
        events: [event]
      });
    } else {
      // Если документ существует, добавляем событие в массив
      const currentEvents = eventDoc.data().events || [];
      await setDoc(eventRef, {
        events: [...currentEvents, event]
      });
    }
    return true;
  } catch (error) {
    console.error("Error saving event:", error);
    return false;
  }
}

// Функция для получения всех событий пользователя
export async function getUserEvents(userId) {
  try {
    const eventRef = doc(db, 'events', userId);
    const eventDoc = await getDoc(eventRef);
    
    if (eventDoc.exists()) {
      return eventDoc.data().events || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
}

// Функция для тестирования сохранения данных
export async function testFirestore() {
  try {
    const testEvent = {
      id: Date.now(),
      title: "Тестовое событие",
      date: new Date().toISOString(),
      time: "12:00",
      description: "Это тестовое событие для проверки Firestore"
    };
    
    const result = await saveEvent("test_user", testEvent);
    console.log("Test event saved:", result);
    
    const events = await getUserEvents("test_user");
    console.log("Retrieved events:", events);
    
    return { success: true, events };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error };
  }
}