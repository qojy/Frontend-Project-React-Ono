import { firestore } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Get all menu items
export async function getMenuItems() {
  const querySnapshot = await getDocs(collection(firestore, "menuItems"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Add a new menu item
export async function addMenuItem(menuItem) {
  const docRef = await addDoc(collection(firestore, "menuItems"), menuItem);
  return docRef.id;
}

// Update a menu item
export async function updateMenuItem(menuItemId, menuItemData) {
  const menuItemRef = doc(firestore, "menuItems", menuItemId);
  await updateDoc(menuItemRef, menuItemData);
}

// Delete a menu item
export async function deleteMenuItem(menuItemId) {
  const menuItemRef = doc(firestore, "menuItems", menuItemId);
  await deleteDoc(menuItemRef);
}
