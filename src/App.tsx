import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import ExtendAbout from "./mainComponents/AboutMe/ExtendAbout";
import PhotoGallery from "./mainComponents/Gallery/PhotoGallery";
import VideoGallery from "./mainComponents/Gallery/VideoGallery";
import ShowPressById from "./mainComponents/Press/ShowPressById";
import { useEffect } from "react";
import LoginUser from "./mainComponents/Admin/LoginUser";
import AdminDash from "./mainComponents/Admin/AdminDash";
import ViewMessage from "./mainComponents/Admin/ViewMessage";
import NotFound from "./mainComponents/NotFound";

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
      {/* Admin Routes */}
      <Route path='/admin/login' element={<LoginUser />} />
      <Route path='/admin/dashboard' element={<AdminDash />} />

      {/*  Contact  Routes */}
      <Route path='/admin/messages/:id' element={<ViewMessage />} />

      {/*  Not Found  Routes */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default App;
