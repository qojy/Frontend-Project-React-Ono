import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage.jsx";
import Help from "./Components/Help.jsx";
import ActiveOrders from "./Components/ActiveOrders.jsx";
import ManageClasses from "./Components/ManageClasses.jsx";
import Menu from "./Components/Menu.jsx";
import NewOrder from "./Components/NewOrder.jsx";
import OrderHistory from "./Components/OrderHistory.jsx";
import StudentsList from "./Components/StudentsList.jsx";
import AppBar from "./Components/AppBar.jsx";

function App() {
  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/activeorders" element={<ActiveOrders />} />
        <Route path="/manageclasses" element={<ManageClasses />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/neworder" element={<NewOrder />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/students" element={<StudentsList />} />
      </Routes>
    </>
  );
}

export default App;
