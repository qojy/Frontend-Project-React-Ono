import { firestore } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Get all classes
export async function getClasses() {
  const querySnapshot = await getDocs(collection(firestore, "classes"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Add a new class
export async function addClass(classData) {
  const docRef = await addDoc(collection(firestore, "classes"), classData);
  return docRef.id;
}

// Update a class
export async function updateClass(classId, classData) {
  const classRef = doc(firestore, "classes", classId);
  await updateDoc(classRef, classData);
}

// Delete a class
export async function deleteClass(classId) {
  const classRef = doc(firestore, "classes", classId);
  await deleteDoc(classRef);
}

// Check if class name exists
export async function checkClassNameExists(className) {
  const q = query(
    collection(firestore, "classes"),
    where("name", "==", className)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
