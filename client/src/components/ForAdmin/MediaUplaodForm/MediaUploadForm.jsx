import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../../../api/api";
import "./MediaUploadForm.css";
import ProductsUpload from '../MediaUplaodForm/ProductsUpload'

const pages = [
  { value: "landingpage", label: "Landing Page" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids&baby", label: "Kids & Baby" },
  { value: "home", label: "Home" },
  { value: "discover", label: "Discover" }
];

const pageSections = [
  { value: "carousel", label: "Carousel" },
  { value: "category", label: "Category" },
  { value: "stories", label: "Stories" },
  { value: "trend", label: "Trend" },
  { value: "explore", label: "Explore" },
  
];

const landingSections = [
  { value: "rlc-hero", label: "Hero" },
  { value: "rlc-block", label: "Block" },
  { value: "rlc-wrapper", label: "Wrapper" },
  { value: "rlc-trend", label: "Trend" },
  {value: "rlc-ads", label: "Ads"}
];

function getSections(page) {
  if (page === "landingpage") {
    return landingSections;
  }
  return pageSections;
}

function MediaUploadForm() {
  const [page, setPage] = useState("landingpage");
  const [section, setSection] = useState("rlc-hero");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Polo Ralph Lauren");
  const [description, setDescription] = useState("");
  const [forMobile, setForMobile] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sections = getSections(page);
  const isVideo = file && file.type.startsWith("video");

  const handlePageChange = (e) => {
    const newPage = e.target.value;
    setPage(newPage);
    setSection(getSections(newPage)[0].value);
  };

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    if (!chosenFile) return;

    setFile(chosenFile);
    setPreview(URL.createObjectURL(chosenFile));
  };

  const resetForm = (formElement) => {
    formElement.reset();
    setPage("landingpage");
    setSection("rlc-hero");
    setTitle("");
    setBrand("Polo Ralph Lauren");
    setDescription("");
    setForMobile(false);
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;

    setMessage("");
    setError("");

    if (!file) {
      setError("Please choose an image or video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title);
    formData.append("brand", brand);
    formData.append("description", description);

    if (forMobile) {
      formData.append("forMobile", "true");
    }

    let url = `/landingPage/${section}`;
    if (page !== "landingpage") {
      url = `/mediaforpage/${encodeURIComponent(page)}/${section}`;
    }

    setUploading(true);

    try {
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Media uploaded successfully.");
      resetForm(formElement);
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <div className="end-0 position-relative pt-3 p-lg-2 media-upload-page">
    <div className=" w-100 pb-5 pt-2 media-upload-form">
     
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 p-3 media-upload-card  rounded-2 h-100"
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="m-0 fs-4 text-uppercase fw-bold title_media font-monospace">
            Upload for Web pages
          </h2>

          <div className="d-flex align-items-center gap-3">
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="forMobile"
                checked={forMobile}
                onChange={(e) => setForMobile(e.target.checked)}
              />
              <label className="form-check-label fw-medium" htmlFor="forMobile">
                {forMobile ? "Mobile" : "Desktop"}
              </label>
            </div>

            <button
              type="submit"
              className="btn px-3 media-upload-btn"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {message && <p className="text-success fw-medium mb-2">{message}</p>}
        {error && <p className="text-danger fw-medium mb-2">{error}</p>}

        <div className="row g-3">
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label fw-medium">Page</label>
                <select
                  className="form-select"
                  value={page}
                  onChange={handlePageChange}
                >
                  {pages.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-medium">Section</label>
                <select
                  className="form-select"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  {sections.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autumn Collection"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Polo Ralph Lauren"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Description</label>
                <textarea
                  className="form-control vela-form-textarea-container"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown with this media"
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium">Image or video</label>
            <label className="media-dropzone d-flex flex-column align-items-center justify-content-center">
              {preview ? (
                isVideo ? (
                  <video src={preview} controls className="media-preview-el" />
                ) : (
                  <img src={preview} alt="Preview" className="media-preview-el" />
                )
              ) : (
                <>
                  <FaCloudUploadAlt size={32} className="mb-2 text-secondary" />
                  <span className="text-secondary fw-medium">
                    Click to choose an image or video
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                className="d-none"
                onChange={handleFileChange}
              />
            </label>
            {file && <p className="text-secondary small mt-1 mb-0">{file.name}</p>}
          </div>
        </div>
      </form>
    </div>
    <ProductsUpload/>
    </div>

    </>
  );
}

export default MediaUploadForm;