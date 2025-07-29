import { lazy } from "react";

// Immediate load components (critical for first page load)
import Home from "../Home";
import ExtendAbout from "../mainComponents/AboutMe/ExtendAbout";
import ContactUs from "../mainComponents/Contact";
import LoginUser from "../mainComponents/Admin/LoginUser";
import NotFound from "../mainComponents/NotFound";

// Lazy load components (loaded only when needed)
const PhotoGallery = lazy(
  () => import("../mainComponents/Gallery/PhotoGallery")
);
const VideoGallery = lazy(
  () => import("../mainComponents/Gallery/VideoGallery")
);
const ViewPhotoId = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/ViewPhotoId")
);
const ViewVideoId = lazy(
  () => import("../mainComponents/Admin/AdminVideo/ViewVideoId")
);
const ShowPressById = lazy(
  () => import("../mainComponents/Press/ShowPressById")
);

// Admin components (lazy loaded)
const AdminDash = lazy(() => import("../mainComponents/Admin/AdminDash"));
const PhotoDash = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/PhotoDash")
);
const AddPhoto = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/AddPhoto")
);
const PhotoViewPage = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/PhotoCardWrapper")
);
const EditPhoto = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/EditPhoto")
);
const VideoDash = lazy(
  () => import("../mainComponents/Admin/AdminVideo/VideoDash")
);
const AddVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/AddVideo")
);
const PlayVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/PlayVideo")
);
const EditVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/EditVideo")
);
const PressDash = lazy(
  () => import("../mainComponents/Admin/AdminPress/PressDash")
);
const AddPress = lazy(
  () => import("../mainComponents/Admin/AdminPress/AddPress")
);
const ReadPress = lazy(
  () => import("../mainComponents/Admin/AdminPress/ReadPress")
);
const EditPress = lazy(
  () => import("../mainComponents/Admin/AdminPress/EditPress")
);
const ViewMessage = lazy(
  () => import("../mainComponents/Admin/AdminMessage/ViewMessage")
);
const ViewAllMessage = lazy(
  () => import("../mainComponents/Admin/AdminMessage/ViewAllMessage")
);
const CategoryManager = lazy(
  () => import("../mainComponents/Admin/AdminCategory/CategoryManager")
);

// Route configuration
export const immediateRoutes = [
  { path: "/", component: Home },
  { path: "/about", component: ExtendAbout },
  { path: "/contact", component: ContactUs },
  { path: "/admin/login", component: LoginUser },
];

export const publicRoutes = [
  { path: "/photo-gallery", component: PhotoGallery },
  { path: "/video-gallery", component: VideoGallery },
  { path: "/view/photo/:id", component: ViewPhotoId },
  { path: "/view/video/:id", component: ViewVideoId },
  { path: "/press/:id", component: ShowPressById },
];

export const adminRoutes = [
  { path: "/admin/dashboard", component: AdminDash },
  { path: "/admin/photoDashboard", component: PhotoDash },
  { path: "/admin/videoDashboard", component: VideoDash },
  { path: "/admin/pressDashboard", component: PressDash },
  { path: "/admin/messages", component: ViewAllMessage },
  { path: "/admin/messages/:id", component: ViewMessage },
  { path: "/admin/categories", component: CategoryManager },
];

// NEW: Admin specific routes with dashboard mapping
export interface AdSpecificRoute {
  path: string;
  component: React.ComponentType;
  parentDashboard: string; // The dashboard this route should go back to
  category: "photo" | "video" | "press" | "message";
}

export const adSpecificRoutes: AdSpecificRoute[] = [
  // Photo specific routes - go back to photoDashboard
  {
    path: "/admin/addPhoto",
    component: AddPhoto,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },
  {
    path: "/admin/view/:id",
    component: PhotoViewPage,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },
  {
    path: "/admin/edit/:id",
    component: EditPhoto,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },

  // Video specific routes - go back to videoDashboard
  {
    path: "/admin/addVideo",
    component: AddVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },
  {
    path: "/admin/play/:id",
    component: PlayVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },
  {
    path: "/admin/editVideo/:id",
    component: EditVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },

  // Press specific routes - go back to pressDashboard
  {
    path: "/admin/addPress",
    component: AddPress,
    parentDashboard: "/admin/pressDashboard",
    category: "press",
  },
  {
    path: "/admin/read/:id",
    component: ReadPress,
    parentDashboard: "/admin/pressDashboard",
    category: "press",
  },
  {
    path: "/admin/editPress/:id",
    component: EditPress,
    parentDashboard: "/admin/pressDashboard",
    category: "press",
  },
];

export const fallbackRoute = { path: "*", component: NotFound };

// NEW: Helper function to get parent dashboard for a route
export const getParentDashboard = (currentPath: string): string | null => {
  // Find the specific route configuration
  const specificRoute = adSpecificRoutes.find((route) => {
    // Handle dynamic routes with parameters
    const routePattern = route.path.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(currentPath);
  });

  return specificRoute?.parentDashboard || null;
};

// NEW: Helper function to get category for current route
export const getRouteCategory = (currentPath: string): string | null => {
  const specificRoute = adSpecificRoutes.find((route) => {
    const routePattern = route.path.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(currentPath);
  });

  return specificRoute?.category || null;
};
