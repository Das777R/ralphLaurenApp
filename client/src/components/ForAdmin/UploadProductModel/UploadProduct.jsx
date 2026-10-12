import { useState } from "react";
import "./UploadProduct.css";
import api from "../../../api/api";

function UploadProduct() {
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

  const [uploadProduct, setUploadProduct] = useState(resetForm);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    setUploadProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? name === "slideImage"
            ? Array.from(files)
            : files[0]
          : value,
    }));
  };

  const handleReset = () => {
    setUploadProduct(resetForm());
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setUploading(true);

    const formData = new FormData();

    Object.entries(uploadProduct).forEach(([key, value]) => {
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
      setUploadProduct(resetForm());
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
    <div
      className="modal fade upload-product-modal"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <form
          className="modal-content border-0 upload-product-modal-content"
          onSubmit={handleSubmit}
        >
          <div className="modal-header border-0 pb-0">
            <h1
              className="modal-title m-0 fs-5 text-uppercase fw-bold font-monospace m-0 fs-4 text-uppercase fw-bold title_media font-monospace m-0 fs-4 text-uppercase fw-bold title_media font-monospace"
              id="staticBackdropLabel"
            >
              Upload Product
            </h1>

            <button
              type="button"
              className="btn-close upload-product-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleReset}
            ></button>
          </div>

          <div className="modal-body">
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
                      value={uploadProduct.productName}
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
                      value={uploadProduct.category}
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
                      value={uploadProduct.kind}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-4">
                    <label className="form-label fw-medium">
                      &#8377; Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      name="price"
                      value={uploadProduct.price}
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
                      value={uploadProduct.stock}
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
                      value={uploadProduct.sizesAvailable}
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
                      value={uploadProduct.colorName}
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
                      value={uploadProduct.brand}
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
                        checked={uploadProduct.trending}
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
                      value={uploadProduct.description}
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
                      <span className="text-secondary fw-medium">
                        Click to choose carousel images
                      </span>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="d-none"
                        name="slideImage"
                        onChange={handleChange}
                      />
                    </label>

                    {uploadProduct.slideImage.length > 0 && (
                      <p className="text-secondary small mt-1 mb-0">
                        {uploadProduct.slideImage.length} image(s) selected
                      </p>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Look Image (Main Look)
                    </label>

                    <label className="upload-product-file-box d-flex align-items-center justify-content-center bg-body">
                      <span className="text-secondary fw-medium">
                        Click to choose look image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        name="lookImage"
                        onChange={handleChange}
                      />
                    </label>

                    {uploadProduct.lookImage && (
                      <p className="text-secondary small mt-1 mb-0">
                        {uploadProduct.lookImage.name}
                      </p>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Color Image
                    </label>

                    <label className="upload-product-file-box d-flex align-items-center justify-content-center bg-body">
                      <span className="text-secondary fw-medium">
                        Click to choose color image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        name="colorImage"
                        onChange={handleChange}
                      />
                    </label>

                    {uploadProduct.colorImage && (
                      <p className="text-secondary small mt-1 mb-0">
                        {uploadProduct.colorImage.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-light upload-product-cancel"
              data-bs-dismiss="modal"
              onClick={handleReset}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary px-3 upload-product-btn"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadProduct;