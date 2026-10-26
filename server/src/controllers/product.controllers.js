import path from "path";
import fs from "fs";
import Products from "../schema/product.schema.js";
import { productPath } from "../middleware/product.multer.middleware.js";
import {
  uploadFilesToCloudinary,
  toCloudinarySlug,
} from "../utils/uploadMediaToCloud.js";

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Removes multer temp files that never got uploaded (validation failures etc.)
const cleanupTempFiles = (files) => {
  if (!files) return;
  Object.values(files)
    .flat()
    .forEach((file) => {
      try {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (err) {
        console.error(`Temp file cleanup failed: ${err.message}`);
      }
    });
};

const parseSizes = (sizesAvailable) => {
  if (Array.isArray(sizesAvailable)) return sizesAvailable;
  if (typeof sizesAvailable !== "string" || !sizesAvailable.trim()) return [];

  try {
    const parsed = JSON.parse(sizesAvailable);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return sizesAvailable
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

/* -------------------------------------------------------------------------- */
/*                                   READ                                     */
/* -------------------------------------------------------------------------- */

export const getProducts = async (req, res) => {
  try {
    const products = await Products.find({});

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        message: "Query parameter q is required.",
        success: false,
      });
    }

    const safeQ = escapeRegex(q);

    const products = await Products.find({
      $or: [
        { brand: { $regex: safeQ, $options: "i" } },
        { productName: { $regex: safeQ, $options: "i" } },
        { description: { $regex: safeQ, $options: "i" } },
        { category: { $regex: safeQ, $options: "i" } },
        { kind: { $regex: safeQ, $options: "i" } },
      ],
    }).limit(20);

    return res.status(200).json({
      message: "Searched Products",
      data: products,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const filterController = async (req, res) => {
  try {
    const { cat, kind } = req.params;
    const { type } = req.query;

    if (!cat || !kind) {
      return res.status(400).json({
        message: "cat and kind are required",
        success: false,
      });
    }

    const query = {
      category: new RegExp(`^${escapeRegex(cat.trim())}$`, "i"),
      kind: new RegExp(`^${escapeRegex(kind.trim())}$`, "i"),
    };

    if (type && type.trim()) {
      query.productName = new RegExp(escapeRegex(type.trim()), "i");
    }

    const filteredProducts = await Products.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Successfully filtered",
      data: filteredProducts,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, kind } = req.params;

    if (!category || !kind) {
      return res.status(400).json({
        message: "Params are empty",
        success: false,
      });
    }

    const productByCategory = await Products.find({
      category: toTitleCase(category),
      kind: toTitleCase(kind),
    });

    return res.status(200).json({
      message: `Product successfully found by ${kind}`,
      data: productByCategory,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductsByName = async (req, res) => {
  try {
    const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({
        message: "product is not found!!",
        success: false,
      });
    }

    const products = await Products.find({ productName });

    if (products.length === 0) {
      return res.status(404).json({
        message: "products by that name does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "products found!!",
      data: products,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductByColor = async (req, res) => {
  try {
    const { product, colorImg } = req.query;

    if (!product || !colorImg) {
      return res.status(400).json({
        message: "req.query is empty or undefined",
        success: false,
      });
    }

    const gotproduct = await Products.findOne({
      productName: product,
      colorImage: colorImg,
    });

    if (!gotproduct) {
      return res.status(404).json({
        message: "product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product found",
      data: gotproduct,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductByColorAndProduct = async (req, res) => {
  try {
    const { clrImg, product } = req.query;

    if (!clrImg || !product) {
      return res.status(400).json({
        message: "req.query does not hold any value or is undefined",
        success: false,
      });
    }

    const item = await Products.findOne({
      colorImage: clrImg,
      productName: product,
    });

    if (!item) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product found successfully!!",
      data: item,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Id missing",
        success: false,
      });
    }

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found in database",
        success: false,
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getproductsForGuestBag = async (req, res) => {
  try {
    const { products } = req.query;

    if (!products) {
      return res.status(400).json({
        message: "products query is required",
        success: false,
      });
    }

    const favItems = Array.isArray(products) ? products : [products];

    const guestBag = await Products.find({ productName: { $in: favItems } });

    return res.status(200).json({
      message: "Found for Guest",
      data: guestBag,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductByKind = async (req, res) => {
  try {
    const { kind } = req.params;

    const products = await Products.find({ kind });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this kind.",
      });
    }

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMatchedProducts = async (req, res) => {
  try {
    const { match } = req.query;
    const { category } = req.params;

    if (!match) {
      return res.status(400).json({
        message: "query is undefined",
        success: false,
      });
    }

    const matchArray = match.split(",");

    const products = await Products.find({
      category,
      kind: { $nin: matchArray },
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "products are not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Matched Products are found!",
      data: products,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

/* -------------------------------------------------------------------------- */
/*                                  UPDATE                                    */
/* -------------------------------------------------------------------------- */

export const updateProductInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock) || 0;
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Updated Successfully🚀",
      success: true,
      updatedProduct,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message, success: false });
  }
};

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // Legacy local folder cleanup (harmless if it doesn't exist)
    const folderPath = path.join(
      productPath,
      product.category,
      product.kind,
      product.productName
    );
    fs.rmSync(folderPath, { recursive: true, force: true });

    return res.status(200).json({
      message: "Product Deleted Successfully!!🗑️",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Failed to Delete!",
      success: false,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                  UPLOAD                                    */
/* -------------------------------------------------------------------------- */

export const uploadProducts = async (req, res) => {
  try {
    const {
      category,
      kind,
      productName: product,
      brand,
      colorName: color,
      price,
      sizesAvailable,
      description,
      trending,
      stock,
    } = req.body;

    const slideImageFiles = req.files?.slideImage || [];
    const colorImageFile = req.files?.colorImage?.[0];
    const lookImageFile = req.files?.lookImage?.[0];

    // ---------- 1. VALIDATE (before any upload happens) ----------
    if (slideImageFiles.length === 0 && !colorImageFile && !lookImageFile) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    if (!category || !kind || !product || !color) {
      cleanupTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "category, kind, productName and colorName are required",
      });
    }

    // ---------- 2. CHECK EXISTING PRODUCT + COLOR ----------
    let productDoc = await Products.findOne({
      category,
      kind,
      productName: product,
      colorName: color,
    });

    if (!productDoc && !colorImageFile) {
      cleanupTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Color image is required for the first upload of a new product!",
      });
    }

    // ---------- 3. UPLOAD TO CLOUDINARY ----------
    // Sanitized path: products/kids-and-baby/shirt/slim-clasic/navy/...
    const baseFolder = [
      "products",
      toCloudinarySlug(category),
      toCloudinarySlug(kind),
      toCloudinarySlug(product),
      toCloudinarySlug(color),
    ].join("/");

    const slideImageUrls = await Promise.all(
      slideImageFiles.map((file) =>
        uploadFilesToCloudinary(file.path, `${baseFolder}/slide`)
      )
    );

    const colorImageUrl = colorImageFile
      ? await uploadFilesToCloudinary(colorImageFile.path, `${baseFolder}/color`)
      : null;

    const lookImageUrl = lookImageFile
      ? await uploadFilesToCloudinary(lookImageFile.path, `${baseFolder}/look`)
      : null;

    // ---------- 4. SAVE TO DB ----------
    if (!productDoc) {
      productDoc = await Products.create({
        category,
        kind,
        productName: product,
        brand,
        colorName: color,
        colorImage: colorImageUrl,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        sizesAvailable: parseSizes(sizesAvailable),
        description,
        trending: trending === "true" || trending === true,
        slideImage: slideImageUrls,
        lookImage: lookImageUrl || "",
      });
    } else {
      if (slideImageUrls.length > 0) productDoc.slideImage.push(...slideImageUrls);
      if (lookImageUrl) productDoc.lookImage = lookImageUrl;
      if (colorImageUrl) productDoc.colorImage = colorImageUrl;
      if (stock !== undefined && stock !== "") productDoc.stock = Number(stock) || 0;

      await productDoc.save();
    }

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully to Cloudinary!",
      data: productDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    cleanupTempFiles(req.files);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};