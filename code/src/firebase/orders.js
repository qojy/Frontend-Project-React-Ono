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

// Get all orders
export async function getOrders() {
  const querySnapshot = await getDocs(collection(firestore, "orders"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Add a new order
export async function addOrder(order) {
  const docRef = await addDoc(collection(firestore, "orders"), order);
  return docRef.id;
}

// Update an order
export async function updateOrder(orderId, orderData) {
  const orderRef = doc(firestore, "orders", orderId);
  await updateDoc(orderRef, orderData);
}

// Delete an order
export async function deleteOrder(orderId) {
  const orderRef = doc(firestore, "orders", orderId);
  await deleteDoc(orderRef);
}

// Get orders by status
export async function getOrdersByStatus(status) {
  const q = query(
    collection(firestore, "orders"),
    where("status", "==", status)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
