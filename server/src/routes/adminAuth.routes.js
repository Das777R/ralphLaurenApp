import { Router } from "express";
import {  ordersOfUsers,getAllOrders,signupController,loginController,getLoggedInAdmin, getTokenController, adminLogoutController} from "../controllers/admin.controllers.js";

const router = Router();


router.get('/auth/login/:adminId', getLoggedInAdmin)
router.post('/placeorder', ordersOfUsers);
router.get('/allOrders', getAllOrders);
router.post('/token', getTokenController);
router.post('/logout', adminLogoutController)
router.post('/auth/login', loginController);
router.post('/auth/signup', signupController);



export default router