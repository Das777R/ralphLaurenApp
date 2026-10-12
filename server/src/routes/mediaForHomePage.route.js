import { Router } from "express";
import { uploadForHomePageMedia,getForHomePageMedia } from "../controllers/mediaHomePage.controllers.js";
import { mediaForHome } from "../middleware/page.multer.middleware.js";

const router = Router();

router.post('/:section', mediaForHome.array('media'), uploadForHomePageMedia);
router.get('/:section', getForHomePageMedia);


export default router

