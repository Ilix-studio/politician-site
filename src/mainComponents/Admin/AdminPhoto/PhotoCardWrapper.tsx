import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, LogOut } from "lucide-react";

import { useDeletePhotoMutation } from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { logout, selectIsAdmin } from "@/redux-store/slices/authSlice";
import PhotoView from "./PhotoView";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";

const PhotoViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const [deletePhoto] = useDeletePhotoMutation();

  if (!id) {
    return (
      <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Photo ID not found</AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Admin access required</AlertDescription>
      </Alert>
    );
  }

  const handleEdit = (photo: any) => {
    navigate(`/admin/edit/${photo._id}`);
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return;

    try {
      await deletePhoto(photoId).unwrap();
      navigate("/admin/photos");
    } catch (error: any) {
      alert(`Delete failed: ${error.data?.message || "Unknown error"}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleHomeRedirect = () => {
    window.location.href = "/admin/photoDashboard";
  };

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={handleHomeRedirect}
              variant='ghost'
              className='group flex items-center gap-3 px-4 py-2 hover:bg-gradient-to-r hover:from-[#FF9933]/10 hover:to-[#138808]/10 rounded-xl transition-all duration-300'
            >
              <div className='relative'>
                <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300' />
                <div className='absolute inset-0 bg-[#FF9933] rounded-full opacity-0 group-hover:opacity-20 animate-ping'></div>
              </div>
              <span className='font-medium'>Back to Photo Dashboard</span>
            </Button>

            <div className='hidden sm:block w-px h-6 bg-gray-300'></div>
          </div>

          <Button
            onClick={handleLogout}
            variant='ghost'
            className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <h1 className='text-3xl font-bold text-slate-800'>View Photo</h1>
        </div>
        <PhotoView
          photoId={id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleHomeRedirect}
          showActions={true}
        />
      </div>
    </>
  );
};

export default PhotoViewPage;
