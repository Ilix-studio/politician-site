import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import ExtendAbout from "./mainComponents/AboutMe/ExtendAbout";
import ContactUs from "./mainComponents/Contact";

import LoginUser from "./mainComponents/Admin/LoginUser";
import AdminDash from "./mainComponents/Admin/AdminDash";
// Photo
import AddPhoto from "./mainComponents/Admin/AdminPhoto/AddPhoto";
import PhotoDash from "./mainComponents/Admin/AdminPhoto/PhotoDash";
import PhotoViewPage from "./mainComponents/Admin/AdminPhoto/PhotoCardWrapper";
import EditPhoto from "./mainComponents/Admin/AdminPhoto/EditPhoto";
import ViewPhotoId from "./mainComponents/Admin/AdminPhoto/ViewPhotoId";
import PhotoGallery from "./mainComponents/Gallery/PhotoGallery";
//Video
import VideoDash from "./mainComponents/Admin/AdminVideo/VideoDash";
import AddVideo from "./mainComponents/Admin/AdminVideo/AddVideo";
import PlayVideo from "./mainComponents/Admin/AdminVideo/PlayVideo";
import EditVideo from "./mainComponents/Admin/AdminVideo/EditVideo";
import ViewVideoId from "./mainComponents/Admin/AdminVideo/ViewVideoId";
import VideoGallery from "./mainComponents/Gallery/VideoGallery";
//Press Articles
import PressDash from "./mainComponents/Admin/AdminPress/PressDash";
import AddPress from "./mainComponents/Admin/AdminPress/AddPress";
import ReadPress from "./mainComponents/Admin/AdminPress/ReadPress";
import EditPress from "./mainComponents/Admin/AdminPress/EditPress";
import ShowPressById from "./mainComponents/Press/ShowPressById";
// Admin Message
import ViewMessage from "./mainComponents/Admin/AdminMessage/ViewMessage";
import ViewAllMessage from "./mainComponents/Admin/AdminMessage/ViewAllMessage";
//Not Found
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

      {/* Admin Routes */}
      <Route path='/admin/login' element={<LoginUser />} />
      <Route path='/admin/dashboard' element={<AdminDash />} />
      {/* Photo Routes */}
      <Route path='/admin/photoDashboard' element={<PhotoDash />} />
      <Route path='/admin/addPhoto' element={<AddPhoto />} />
      <Route path='/admin/view/:id' element={<PhotoViewPage />} />
      <Route path='/admin/edit/:id' element={<EditPhoto />} />
      {/* Public Gallery Photo component */}
      <Route path='/photo-gallery' element={<PhotoGallery />} />
      <Route path='/view/photo/:id' element={<ViewPhotoId />} />

      {/* Video Routes */}
      <Route path='/admin/videoDashboard' element={<VideoDash />} />
      <Route path='/admin/addVideo' element={<AddVideo />} />
      <Route path='/admin/play/:id' element={<PlayVideo />} />
      <Route path='/admin/editVideo/:id' element={<EditVideo />} />
      {/* Public Gallery Videocomponent */}
      <Route path='/video-gallery' element={<VideoGallery />} />
      <Route path='/view/video/:id' element={<ViewVideoId />} />

      {/* Press Articles Routes */}

      <Route path='/admin/pressDashboard' element={<PressDash />} />
      <Route path='/admin/addPress' element={<AddPress />} />
      <Route path='/admin/read/:id' element={<ReadPress />} />
      <Route path='/admin/editPress/:id' element={<EditPress />} />
      {/* Public Press Articles */}
      <Route path='/press/:id' element={<ShowPressById />} />

      {/*  Contact  Routes */}
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/admin/messages' element={<ViewAllMessage />} />
      <Route path='/admin/messages/:id' element={<ViewMessage />} />

      {/*  Not Found  Routes */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default App;
