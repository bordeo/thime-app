import firebase from "firebase";
import firebaseConfig from "../../config/firebase";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

export { db, auth };
