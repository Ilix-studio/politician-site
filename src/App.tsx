import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ExtendAbout from "./mainCoponents/AboutMe/ExtendAbout";
import PhotoGallery from "./mainCoponents/Gallery/PhotoGallery";
import VideoGallery from "./mainCoponents/Gallery/VideoGallery";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<ExtendAbout />} />
      <Route path='/photo-gallery' element={<PhotoGallery />} />
      <Route path='/video-gallery' element={<VideoGallery />} />
    </Routes>
  );
};

export default App;
