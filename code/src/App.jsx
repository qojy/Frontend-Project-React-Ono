import Header from "./Components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage.jsx";
import Help from "./Components/Help.jsx";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </>
  );
}

export default App;
