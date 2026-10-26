import { Router } from "express";
import { getForMenGrid, uploadMediaToPage } from "../controllers/mediaPage.controllers.js";
import { uploadMediaForWeb } from "../middleware/page.multer.middleware.js";

const router = Router();

// "media" = banner image/video(s), "thumb" = optional tab thumbnail (carousel only),
// "background" = optional background image
router.post(
  "/:nav/:part",
  uploadMediaForWeb.fields([
    { name: "media", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  uploadMediaToPage
);
router.get("/:nav/:part", getForMenGrid);

export default router;