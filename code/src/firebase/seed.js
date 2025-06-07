import { addMenuItem, getMenuItems } from "./menu";
import { addClass, getClasses } from "./classes";
import { addStudent, getStudents } from "./students";
import { addOrder } from "./orders";
import { firestore } from "./config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function seedFirestore() {
  // Seed menu items
  const menuItemsSeed = [
    {
      name: "Pizza",
      price: 50,
      description: "Classic Margherita Pizza",
      allergens: "gluten, dairy",
      prepTime: 20,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Hamburger",
      price: 45,
      description: "Beef burger with fries",
      allergens: "gluten, eggs, sesame",
      prepTime: 15,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Salad",
      price: 25,
      description: "Fresh garden salad",
      allergens: "",
      prepTime: 10,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pasta",
      price: 35,
      description: "Pasta with tomato sauce",
      allergens: "gluten",
      prepTime: 18,
      image:
        "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    },
  ];
  for (const item of menuItemsSeed) {
    await addMenuItem(item);
  }

  // Seed classes
  const classesSeed = [
    { name: "Class A", room: "101" },
    { name: "Class B", room: "102" },
    { name: "Class C", room: "103" },
    { name: "Class D", room: "104" },
  ];
  for (const c of classesSeed) {
    await addClass(c);
  }

  // Seed students
  const studentsSeed = [
    { fullName: "Alice Smith", id: "S001" },
    { fullName: "Bob Johnson", id: "S002" },
    { fullName: "Charlie Lee", id: "S003" },
    { fullName: "Dana Kim", id: "S004" },
  ];
  for (const s of studentsSeed) {
    await addStudent(s);
  }

  // Fetch the real seeded data
  const menuItems = await getMenuItems();
  const classes = await getClasses();
  const students = await getStudents();

  // Helper to get random element
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Seed orders with real references and a mix of statuses
  const statuses = [
    "preparing",
    "active",
    "delivered",
    "delivered",
    "preparing",
    "active",
    "delivered",
  ];
  for (let i = 0; i < 7; i++) {
    const student = random(students);
    const classObj = random(classes);
    const items = [random(menuItems)];
    if (Math.random() > 0.5) items.push(random(menuItems));
    await addOrder({
      student: student.fullName,
      studentId: student.id,
      className: classObj.name,
      room: classObj.room,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })),
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
      paymentMethod: random(["cash", "credit", "bit"]),
      status: statuses[i % statuses.length],
      date: new Date().toISOString(),
    });
  }

  return "Seeding complete!";
}

export async function resetFirestore() {
  const collections = ["orders", "classes", "students", "menuItems"];
  for (const col of collections) {
    const snapshot = await getDocs(collection(firestore, col));
    for (const d of snapshot.docs) {
      await deleteDoc(doc(firestore, col, d.id));
    }
  }
  return "Reset complete!";
}
