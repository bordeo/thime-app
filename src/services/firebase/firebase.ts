import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from "../../config/firebase";

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, analytics };
