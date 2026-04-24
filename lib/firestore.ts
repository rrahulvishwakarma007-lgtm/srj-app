import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Save enquiry
export const saveEnquiry = async (data: any) => {
  try {
    await addDoc(collection(db, "enquiries"), {
      ...data,
      createdAt: new Date(),
    });
  } catch (e) {
    console.log("Enquiry error:", e);
  }
};

// Save appointment
export const saveAppointment = async (data: any) => {
  try {
    await addDoc(collection(db, "appointments"), {
      ...data,
      createdAt: new Date(),
    });
  } catch (e) {
    console.log("Appointment error:", e);
  }
};
