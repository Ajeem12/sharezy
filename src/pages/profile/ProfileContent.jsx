import React, { useState, useEffect } from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiPencil,
  HiCheck,
  HiOutlineLogout,
  HiUser
} from "react-icons/hi";
import {
  updateProfileField,
  setImage,
  saveProfile,
  fetchProfile,
} from "../../redux/features/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import SharezyLoader from "../../components/SharezyLoader";
import { useAuth } from "../../context/AuthContext"; // adjust path accordingly
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const ProfileContent = () => {
  const dispatch = useDispatch();
  const {
    data: formData,
    image,
    status,
    error,
  } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous object URL to avoid memory leaks
      if (image?.preview) URL.revokeObjectURL(image.preview);

      dispatch(
        setImage({
          file: file,
          preview: URL.createObjectURL(file),
        })
      );
    }
  };

  const handleInputChange = (field, value) => {
    dispatch(updateProfileField({ field, value }));
  };

 const handleSave = async () => {
  setIsEditing(false);

  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("email", formData.email);
  payload.append("mobile", formData.mobile);
  payload.append("location", formData.location);

  if (image?.file instanceof File) {
    payload.append("profile_image", image.file);
  }

  try {
    // Assuming saveProfile returns a promise
    await dispatch(saveProfile(payload)).unwrap(); // unwrap if using RTK Query or createAsyncThunk

    toast.success("Profile saved successfully!");
    dispatch(fetchProfile());
  } catch (error) {
    toast.error("Failed to save profile. Please try again.");
    console.error("Save profile error:", error);
  }
};
  const handleCancel = () => {
    setIsEditing(false);
    // Reset image if it was changed but not saved
    if (image?.file) {
      URL.revokeObjectURL(image.preview);
      dispatch(resetProfileImage());
    }
  };

  const handleLogout = () => {
    setIsLoading(true);

    // Simulate an async logout (if needed, add await for API logout)
    setTimeout(() => {
      logout();
      toast.success("You have been logged out successfully!")
      navigate("/login");
      setIsLoading(false);
    }, 1500);
  };
  // Should log complete URL

 


  // Clean up object URLs when component unmounts
  useEffect(() => {
  let objectUrl;

  if (image?.file instanceof File) {
    objectUrl = URL.createObjectURL(image.file);
    setImage((prev) => ({
      ...prev,
      preview: objectUrl,
    }));
  }

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [image?.file]);

 const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL?.replace(/\/$/, "");
const displayImage = `${imageBaseUrl}/uploads/users/${formData.profile_image}`;

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-30">
        <SharezyLoader />
      </div>
    );
  }

if (status === "failed") {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-red-300 bg-red-50 rounded-lg text-red-800 text-center shadow-md">
      <p className="font-semibold text-lg">Failed to load profile</p>
      <p className="mt-2 text-sm">{error || "Something went wrong while fetching your profile."}</p>

      <button
        onClick={() => dispatch(fetchProfile())}
        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded shadow transition"
      >
        Retry
      </button>
    </div>
  );
}


  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-5xl mx-auto">
      {isLoading && <SharezyLoader />}
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-blue-500 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineUser className="text-blue-600" /> Profile Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal info.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <HiPencil className="text-blue-600" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-green-600 hover:underline"
              disabled={status === "loading"}
            >
              <HiCheck className="text-green-600" />
              {status === "loading" ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10">
  {/* Profile Image */}
  <div className="flex flex-col items-center">
    <div className="relative w-32 h-32">
      {formData.profile_image ? (
        <img
          src={displayImage}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-4 border-blue-100 shadow"
        />
      ) : (
        <div className="w-full h-full rounded-full border-4 border-blue-100 shadow bg-gray-100 flex items-center justify-center">
          {/* Using a more universally available icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
      )}
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
        </label>
      )}
    </div>
    <p className="mt-3 text-sm text-gray-600">Profile Photo</p>
  
</div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-4 py-2">
              <HiOutlineUser className="text-blue-500 mr-2" />
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-4 py-2">
              <HiOutlineMail className="text-blue-500 mr-2" />
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="flex items-center  border bg-blue-50 border-gray-300 rounded-md px-4 py-2">
              <HiOutlinePhone className="text-blue-500 mr-2" />
              <input
                type="tel"
                value={formData.mobile || ""}
                readOnly
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className="w-full outline-none "
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-4 py-2">
              <HiOutlineLocationMarker className="text-blue-500 mr-2" />
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full sm:w-auto"
          onClick={handleLogout}
        >
          <HiOutlineLogout size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileContent;
