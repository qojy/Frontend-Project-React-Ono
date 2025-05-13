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

// Get all students
export async function getStudents() {
  const querySnapshot = await getDocs(collection(firestore, "students"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Add a new student
export async function addStudent(student) {
  const docRef = await addDoc(collection(firestore, "students"), {
    fullName: student.fullName,
    id: student.id,
  });
  return docRef.id;
}

// Update a student
export async function updateStudent(studentId, studentData) {
  const studentRef = doc(firestore, "students", studentId);
  await updateDoc(studentRef, {
    fullName: studentData.fullName,
    id: studentData.id,
  });
}

// Delete a student
export async function deleteStudent(studentId) {
  const studentRef = doc(firestore, "students", studentId);
  await deleteDoc(studentRef);
}

// Check if student ID exists
export async function checkStudentIdExists(studentId) {
  const q = query(
    collection(firestore, "students"),
    where("id", "==", studentId)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
