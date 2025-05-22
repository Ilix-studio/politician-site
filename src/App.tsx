import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ExtendAbout from "./mainCoponents/AboutMe/ExtendAbout";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<ExtendAbout />} />
    </Routes>
  );
};

export default App;
