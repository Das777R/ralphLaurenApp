import { Router } from "express";
import { uploadFields } from "../middleware/product.multer.middleware.js";
import {
  uploadProducts,
  getProducts,
  removeProduct,
  getProductById,
  updateProductInfo,
  getproductsForGuestBag,
  getProductsByCategory,
  searchProducts,
  getProductByColorAndProduct,
  getProductsByName,
  getProductByColor,
  getProductByKind,
  getMatchedProducts,
  filterController
} from "../controllers/product.controllers.js";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/guestBag", getproductsForGuestBag);



router.post("/upload", uploadFields, uploadProducts);
router.get("/productByColor", getProductByColorAndProduct);
router.get("/getproductByClr", getProductByColor);
router.get("/getproductByName", getProductsByName);
router.get('/lookup/match/:category', getMatchedProducts);
router.get("/kind/:kind", getProductByKind);
router.get("/:category/:kind", getProductsByCategory);
router.get('/filter/:cat/:kind', filterController);



router.delete("/remove/:id", removeProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProductInfo);

export default router;