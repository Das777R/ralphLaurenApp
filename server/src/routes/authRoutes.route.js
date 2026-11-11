import { Router } from "express";
import {
  signupController,
  loginController,
  refreshTokenController,
  getCustomer,
  getUserBag,
  putUserProductsOnBag,
  deleteFromBag,
  updateQtyOfTheProduct,
  deleteUserBag,
  ordersOfUsers,
  createOrderController,
  verifyPaymentController
} from "../controllers/authController.controller.js";
import { verifyToken, isAdmin, isOwner } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signin", signupController);
router.post("/login", loginController);
router.post("/token", refreshTokenController);
router.post("/create-order", createOrderController);
router.post("/verify-payment", verifyPaymentController);
router.post("/placeorder", ordersOfUsers);

router.get("/customers", verifyToken, isAdmin, getCustomer);

router.delete("/userBag/:userId", verifyToken, isOwner, deleteUserBag);
router.get("/:userId", verifyToken, isOwner, getUserBag);
router.put("/:userId", verifyToken, isOwner, putUserProductsOnBag);
router.delete("/:userId/bag/:productId", verifyToken, isOwner, deleteFromBag);
router.put("/:userId/:productId", verifyToken, isOwner, updateQtyOfTheProduct);

export default router;