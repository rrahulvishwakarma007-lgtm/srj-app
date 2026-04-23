import { signInWithEmailAndPassword } from "firebase/auth";

const signin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.log(e.message);
  }
};
