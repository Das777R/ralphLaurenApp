import fs from "fs";
import PartForWebPage from "../schema/mediaForPage.schema.js";

import { uploadFilesToCloudinary, toCloudinarySlug } from "../utils/uploadMediaToCloud.js";

const VALID_PARTS = ["carousel", "stories", "category", "trend", "explore"];

// Only these parts accept a tab thumbnail
const THUMB_PARTS = ["carousel"];

// Remove any temp files Multer left on disk (safe if already deleted)
const cleanupLocalFiles = (files = []) => {
  files.forEach((file) => {
    try {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (err) {
      console.error(`Failed to delete local file: ${err.message}`);
    }
  });
};

// Works with upload.fields() (object) and upload.array() (array)
const splitFiles = (files) => {
  if (Array.isArray(files)) {
    return { mediaFiles: files, thumbFile: undefined, bgFile: undefined };
  }
  return {
    mediaFiles: files?.media || [],
    thumbFile: files?.thumb?.[0],
    bgFile: files?.background?.[0], // optional background image
  };
};

export const uploadMediaToPage = async (req, res) => {
  const { mediaFiles, thumbFile, bgFile } = splitFiles(req.files);
  const allFiles = [
    ...mediaFiles,
    ...(thumbFile ? [thumbFile] : []),
    ...(bgFile ? [bgFile] : []),
  ];

  try {
    const { nav, part } = req.params;
    const { brand, title, description, forMobile } = req.body;

    if (mediaFiles.length === 0) {
      cleanupLocalFiles(allFiles);
      return res.status(400).json({
        message: "No files uploaded",
        success: false,
      });
    }

    if (!VALID_PARTS.includes(part)) {
      cleanupLocalFiles(allFiles);
      return res.status(400).json({
        message: "Invalid Part",
        success: false,
      });
    }

    // e.g. "kids&baby" -> "kids-and-baby"  =>  rlc/pages/kids-and-baby/carousel
    const cloudFolder = `rlc/pages/${toCloudinarySlug(nav)}/${toCloudinarySlug(part)}`;

    // Thumbnail is only kept for parts that use it; otherwise discard the temp file
    const useThumb = !!thumbFile && THUMB_PARTS.includes(part);
    if (thumbFile && !useThumb) cleanupLocalFiles([thumbFile]);

    // Upload banner media (+ thumbnail + background) to Cloudinary
    const [mediaUrls, thumbUrl, backgroundUrl] = await Promise.all([
      Promise.all(
        mediaFiles.map((file) => uploadFilesToCloudinary(file.path, cloudFolder))
      ),
      useThumb
        ? uploadFilesToCloudinary(thumbFile.path, `${cloudFolder}/thumbs`)
        : Promise.resolve(undefined),
      bgFile
        ? uploadFilesToCloudinary(bgFile.path, `${cloudFolder}/backgrounds`)
        : Promise.resolve(undefined),
    ]);

    const info = {
      media: mediaUrls, // full https Cloudinary URLs
      brand,
      title,
      description,
      forMobile: forMobile === "true" || forMobile === true,
      ...(thumbUrl ? { thumb: thumbUrl } : {}),
      ...(backgroundUrl ? { background: backgroundUrl } : {}),
    };

    let MediaPageExists = await PartForWebPage.findOne({ nav });

    if (!MediaPageExists) {
      MediaPageExists = await PartForWebPage.create({
        nav,
        part: [
          {
            carousel: part === "carousel" ? [info] : [],
            stories: part === "stories" ? [info] : [],
            category: part === "category" ? [info] : [],
            trend: part === "trend" ? [info] : [],
            explore: part === "explore" ? [info] : [],
          },
        ],
      });
    } else {
      if (!MediaPageExists.part || MediaPageExists.part.length === 0) {
        MediaPageExists.part.push({});
      }
      const firstPart = MediaPageExists.part[0];
      if (!Array.isArray(firstPart[part])) firstPart[part] = [];
      firstPart[part].push(info);
      await MediaPageExists.save();
    }

    return res.status(201).json({
      message: "Media uploaded Successfully🚀",
      success: true,
      data: MediaPageExists,
    });
  } catch (err) {
    // If something failed midway, don't leave temp files behind
    cleanupLocalFiles(allFiles);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getForMenGrid = async (req, res) => {
  try {
    const { nav, part } = req.params;

    if (!nav || !part) {
      return res.status(400).json({
        message: "Params are invalid",
        success: false,
      });
    }

    const isMenGrid = await PartForWebPage.findOne({ nav });

    if (!isMenGrid || !isMenGrid.part || isMenGrid.part.length === 0) {
      return res.status(404).json({
        message: "Not found in the backend",
        success: false,
      });
    }

    const partData = isMenGrid.part[0][part] || [];

    return res.status(200).json({
      message: "Here is your data for your component",
      data: partData,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};