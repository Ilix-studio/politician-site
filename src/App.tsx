import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import ExtendAbout from "./mainCoponents/AboutMe/ExtendAbout";
import PhotoGallery from "./mainCoponents/Gallery/PhotoGallery";
import VideoGallery from "./mainCoponents/Gallery/VideoGallery";
import ShowPressById from "./mainCoponents/Press/ShowPressById";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<ExtendAbout />} />
      <Route path='/photo-gallery' element={<PhotoGallery />} />
      <Route path='/video-gallery' element={<VideoGallery />} />
      <Route path='/press/:id' element={<ShowPressById />} />
    </Routes>
  );
};

export default App;
