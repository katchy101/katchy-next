import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRw6Hv25YWabP17DQ-c0KwbblsuDWl-Z8",
  authDomain: "katchy-next.firebaseapp.com",
  projectId: "katchy-next",
  storageBucket: "katchy-next.appspot.com",
  messagingSenderId: "976911179164",
  appId: "1:976911179164:web:677bfd425728a9c07fbc59",
  measurementId: "G-GRQM6JM7N3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Helper Functions

// Return User Doc
export const getUserWithUsername = async (username) => {
  const usersRef = firestore.collection(`users`),
    query = usersRef.where(`username`, `==`, username).limit(1),
    userDoc = (await query.get()).docs[0];
  return userDoc;
};
// Converts Doc to JSON
export const postsToJSON = async (doc) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
};
