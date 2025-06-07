import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import StudentDashboard from "./Components/StudentDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import Menu from "./Components/Menu";
import NewOrder from "./Components/NewOrder";
import ActiveOrders from "./Components/ActiveOrders";
import OrderHistory from "./Components/OrderHistory";
import Help from "./Components/Help";
import ManageClasses from "./Components/ManageClasses";
import StudentsList from "./Components/StudentsList";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/neworder" element={<NewOrder />} />
        <Route path="/activeorders" element={<ActiveOrders />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/help" element={<Help />} />
        <Route path="/manageclasses" element={<ManageClasses />} />
        <Route path="/studentslist" element={<StudentsList />} />
      </Routes>
    </>
  );
}

export default App;
