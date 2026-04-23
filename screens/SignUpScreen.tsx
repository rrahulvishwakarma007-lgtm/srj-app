import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const signup = async (email, password, name) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Save user in Firestore
    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      createdAt: new Date()
    });

    console.log("User created");
  } catch (e) {
    console.log(e.message);
  }
};
