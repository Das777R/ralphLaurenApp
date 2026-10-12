import { Router } from "express";
import { getForMenGrid,uploadMediaToPage } from "../controllers/mediaPage.controllers.js";
import { uploadMediaForWeb } from "../middleware/page.multer.middleware.js";

const router = Router();


router.post('/:nav/:part', uploadMediaForWeb.array("media"), uploadMediaToPage);
router.get('/:nav/:part', getForMenGrid);

export default router