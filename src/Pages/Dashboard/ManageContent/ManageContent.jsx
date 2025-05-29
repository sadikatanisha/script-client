import React, { useEffect, useState } from "react";
import {
  useGetBannerQuery,
  useUpdateBannerMutation,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} from "../../../redux/apiSlice";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const ManageContent = () => {
  const {
    data: banners,
    isLoading: isBannersLoading,
    isError: isBannersError,
    refetch: refetchBanners,
  } = useGetBannerQuery();

  const [mode, setMode] = useState("create"); // 'create' or 'edit'
  const [editingBannerId, setEditingBannerId] = useState(null);

  const [bannerHeader, setBannerHeader] = useState("");
  const [bannerSubHeader, setBannerSubHeader] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  const [
    createBanner,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorObj,
    },
  ] = useCreateBannerMutation();

  const [
    updateBanner,
    {
      isLoading: isUpdating,
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorObj,
    },
  ] = useUpdateBannerMutation();

  const [
    deleteBanner,
    { isSuccess: deleteSuccess, isError: deleteError, error: deleteErrorObj },
  ] = useDeleteBannerMutation();

  useEffect(() => {
    if (mode === "edit" && editingBannerId && banners) {
      const toEdit = banners.find((b) => b._id === editingBannerId);
      if (toEdit) {
        setBannerHeader(toEdit.header || "");
        setBannerSubHeader(toEdit.subHeader || "");
        setBannerImage(null);
      }
    } else {
      setBannerHeader("");
      setBannerSubHeader("");
      setBannerImage(null);
    }
  }, [editingBannerId, banners, mode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setBannerImage(acceptedFiles[0]),
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("header", bannerHeader);
    formData.append("subHeader", bannerSubHeader);
    if (bannerImage) formData.append("image", bannerImage);

    try {
      if (mode === "create") {
        await createBanner(formData).unwrap();
      } else {
        if (!editingBannerId) throw new Error("No banner selected");
        await updateBanner({ id: editingBannerId, formData }).unwrap();
      }

      resetForm();
      refetchBanners();
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  const resetForm = () => {
    setMode("create");
    setEditingBannerId(null);
    setBannerHeader("");
    setBannerSubHeader("");
    setBannerImage(null);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      if (editingBannerId === id) resetForm();
      refetchBanners();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isBannersLoading)
    return <div className="p-6 animate-pulse">Loading banners...</div>;
  if (isBannersError)
    return <div className="p-6 text-red-500">⚠️ Failed to load banners</div>;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Create/Edit Section */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {mode === "create" ? "Create New Banner" : "Edit Banner"}
          </h1>
          <button
            onClick={() => setMode(mode === "create" ? "edit" : "create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
          >
            {mode === "create" ? <FiEdit /> : <FiPlus />}
            {mode === "create" ? "Switch to Edit" : "Switch to Create"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header
              </label>
              <input
                type="text"
                value={bannerHeader}
                onChange={(e) => setBannerHeader(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter banner header"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subheader
              </label>
              <input
                type="text"
                value={bannerSubHeader}
                onChange={(e) => setBannerSubHeader(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter banner subheader"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                  ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {bannerImage
                      ? `Selected: ${bannerImage.name}`
                      : "Drag & drop an image, or click to select"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all
                ${
                  isCreating || isUpdating
                    ? "bg-blue-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isCreating
                ? "Creating..."
                : isUpdating
                ? "Updating..."
                : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>

          {(createError || updateError) && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
              {createErrorObj?.data?.message ||
                updateErrorObj?.data?.message ||
                "Operation failed"}
            </div>
          )}
          {(createSuccess || updateSuccess) && (
            <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-xl">
              Operation completed successfully!
            </div>
          )}
        </form>
      </div>

      {/* Banners Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">All Banners</h2>

        {banners?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
            No banners found. Create one now!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners?.map((banner) => (
              <div
                key={banner._id}
                className="group bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {banner.image?.url && (
                  <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={banner.image.url}
                      alt={banner.header}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {banner.header}
                  </h3>
                  <p className="text-sm text-gray-600">{banner.subHeader}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setMode("edit");
                        setEditingBannerId(banner._id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteError && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
            {deleteErrorObj?.data?.message || "Failed to delete banner"}
          </div>
        )}
        {deleteSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-xl">
            Banner deleted successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
