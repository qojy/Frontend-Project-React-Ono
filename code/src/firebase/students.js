import { firestore } from "./config";
import { collection, addDoc } from "firebase/firestore";

export async function addStudent(student) {
  const docRef = addDoc(collection(firestore, "students"), student);
  return docRef.id;
}
