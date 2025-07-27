import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { useDeletePhotoMutation } from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import PhotoView from "./PhotoView";

import { BackNavigation } from "@/config/navigation/BackNavigation";

const PhotoViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleHomeRedirect = () => {
    window.location.href = "/admin/photoDashboard";
  };

  return (
    <>
      <BackNavigation />

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
