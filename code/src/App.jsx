import Header from "./Components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage.jsx";
import Help from "./Components/Help.jsx";
import ActiveOrders from "./Components/ActiveOrders.jsx";
import ManageClasses from "./Components/ManageClasses.jsx";
import Menu from "./Components/Menu.jsx";
import NewOrder from "./Components/NewOrder.jsx";
import OrderHistory from "./Components/OrderHistory.jsx";
import OrderStatus from "./Components/OrderStatus.jsx";
import StudentsList from "./Components/StudentsList.jsx";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/ActiveOrders" element={<ActiveOrders />} />
        <Route path="/ManageClasses" element={<ManageClasses />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/NewOrder" element={<NewOrder />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/OrderStatus" element={<OrderStatus />} />
        <Route path="/StudentList" element={<StudentsList />} />
      </Routes>
    </>
  );
}

export default App;
