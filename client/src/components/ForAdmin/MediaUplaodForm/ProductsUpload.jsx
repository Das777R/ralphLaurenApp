import { useEffect, useState } from "react";
import "./ProductsUpload.css";
import api from "../../../api/api";

function ProductsUpload() {
  const resetForm = () => ({
    category: "",
    kind: "",
    slideImage: [],
    lookImage: null,
    colorName: "",
    colorImage: null,
    brand: "Polo Ralph Lauren",
    productName: "",
    price: "",
    stock: "",
    sizesAvailable: "",
    description: "",
    trending: false,
  });

  const resetPreviews = () => ({
    slideImage: [],
    lookImage: "",
    colorImage: "",
  });

  const [ProductsUpload, setProductsUpload] = useState(resetForm);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState(resetPreviews);

  useEffect(() => {
    return () => {
      [...previews.slideImage, previews.lookImage, previews.colorImage]
        .filter(Boolean)
        .forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const fileList = Array.from(files);

      setProductsUpload((prev) => ({
        ...prev,
        [name]: name === "slideImage" ? fileList : fileList[0] || null,
      }));

      const urls = fileList.map((file) => URL.createObjectURL(file));

      setPreviews((prev) => ({
        ...prev,
        [name]: name === "slideImage" ? urls : urls[0] || "",
      }));

      return;
    }

    setProductsUpload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setUploading(true);

    const formData = new FormData();

    Object.entries(ProductsUpload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "slideImage") {
          Array.from(value).forEach((file) => {
            formData.append("slideImage", file);
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      await api.post("/product/upload", formData);

      setMessage("Product uploaded successfully.");
      setProductsUpload(resetForm());
      setPreviews(resetPreviews());
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Product upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-100 py-5 w-100 product-upload-form">
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 p-3 upload-product-card h-100"
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="m-0 fs-3 text-uppercase fw-bold admin-ralph-logo title_media font-monospace">
            Upload Product
          </h2>

          <button
            type="submit"
            className="btn  px-3 upload-product-btn"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {message && (
          <p className="text-success fw-medium mb-2">
            {message}
          </p>
        )}

        {error && (
          <p className="text-danger fw-medium mb-2">
            {error}
          </p>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-12">
                <label className="form-label fw-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Classic T-Shirt"
                  name="productName"
                  value={ProductsUpload.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-6">
                <label className="form-label fw-medium">
                  Category
                </label>

                <select
                  className="form-select"
                  name="category"
                  value={ProductsUpload.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids&baby">Kids & Baby</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-medium">
                  Kind
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Sweater, Shirt, Pants"
                  name="kind"
                  value={ProductsUpload.kind}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label fw-medium">
                  Price
                </label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  name="price"
                  value={ProductsUpload.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label fw-medium">
                  Stock
                </label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="000"
                  name="stock"
                  value={ProductsUpload.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label fw-medium">
                  Sizes
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="S, M, L, XL"
                  name="sizesAvailable"
                  value={ProductsUpload.sizesAvailable}
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <label className="form-label fw-medium">
                  Color
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Red, Blue"
                  name="colorName"
                  value={ProductsUpload.colorName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <label className="form-label fw-medium">
                  Brand
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Polo Ralph Lauren"
                  name="brand"
                  value={ProductsUpload.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 ms-4">
                <div className="form-check upload-product-trending">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="trendingCheck"
                    name="trending"
                    checked={ProductsUpload.trending}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label fw-medium"
                    htmlFor="trendingCheck"
                  >
                    Mark as Trending Product
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">
                  Description
                </label>

                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Product description..."
                  name="description"
                  value={ProductsUpload.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-medium">
                  Slide Images (Carousel)
                </label>

                <label className="upload-product-file-box d-flex flex-column align-items-center justify-content-center bg-body">
                  {previews.slideImage.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      {previews.slideImage.map((url) => (
                        <img
                          key={url}
                          src={url}
                          className="upload-product-preview-img"
                          alt=""
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-secondary fw-medium">
                      Click to choose carousel images
                    </span>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="d-none"
                    name="slideImage"
                    onChange={handleChange}
                  />
                </label>

                {ProductsUpload.slideImage.length > 0 && (
                  <p className="text-secondary small mt-1 mb-0">
                    {ProductsUpload.slideImage.length} image(s) selected
                  </p>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">
                  Look Image (Main Look)
                </label>

                <label className="upload-product-file-box d-flex align-items-center justify-content-center bg-body">
                  {previews.lookImage ? (
                    <img
                      src={previews.lookImage}
                      className="upload-product-preview-img"
                      alt=""
                    />
                  ) : (
                    <span className="text-secondary fw-medium">
                      Click to choose look image
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    name="lookImage"
                    onChange={handleChange}
                  />
                </label>

                {ProductsUpload.lookImage && (
                  <p className="text-secondary small mt-1 mb-0">
                    {ProductsUpload.lookImage.name}
                  </p>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">
                  Color Image
                </label>

                <label className="upload-product-file-box d-flex align-items-center justify-content-center bg-body">
                  {previews.colorImage ? (
                    <img
                      src={previews.colorImage}
                      className="upload-product-preview-img"
                      alt=""
                    />
                  ) : (
                    <span className="text-secondary fw-medium">
                      Click to choose color image
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    name="colorImage"
                    onChange={handleChange}
                  />
                </label>

                {ProductsUpload.colorImage && (
                  <p className="text-secondary small mt-1 mb-0">
                    {ProductsUpload.colorImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductsUpload;