import MediaForHomePage from "../schema/mediaForHomePage.schema.js";
import { uploadFilesToCloudinary } from "../utils/uploadMediaToCloud.js"; // adjust path if needed

const section_field_map = {
  "rlc-hero": "rlc_hero",
  "rlc-block": "rlc_block",
  "rlc-wrapper": "rlc_wrapper",
  "rlc-trend": "rlc_trend",
  "rlc-ads": "rlc_ads",
};

export const uploadForHomePageMedia = async (req, res) => {
  try {
    const { section } = req.params;
    const dbField = section_field_map[section];

    if (!dbField) {
      return res.status(400).json({
        message: "Unknown section",
        success: false,
      });
    }

    const { title, brand, description, forMobile } = req.body;

    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        message: "The files are not uploaded",
        success: false,
      });
    }

    // Upload every file to Cloudinary
    // Folder structure example: home/rlc_hero
    const folder = `home/${dbField}`;

    const mediaUrls = await Promise.all(
      req.files.map((file) => uploadFilesToCloudinary(file.path, folder))
    );

    const mediaInfo = {
      title,
      brand,
      description,
      media: mediaUrls,               // now contains Cloudinary secure_urls
      forMobile: forMobile === true || forMobile === "true",
    };

    let mediaForHome = await MediaForHomePage.findOne({});

    if (!mediaForHome) {
      mediaForHome = await MediaForHomePage.create({
        [dbField]: [mediaInfo],
      });
    } else {
      mediaForHome[dbField].push(mediaInfo);
      await mediaForHome.save();
    }

    return res.status(201).json({
      message: "Media for Home is Successfully uploaded!!",
      success: true,
      data: mediaForHome,
    });
  } catch (err) {
    console.error("Home media upload error:", err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getForHomePageMedia = async (req,res) => {
  try{
  const {section} = req.params;

  const fieldName = section_field_map[section];


  if(!fieldName){
    return res.status(400).json({
      message: "data is not found",
      success: false
    })
  }

  const getForRlfHero = await MediaForHomePage.findOne({[fieldName]:{$exists: true, $not: {$size: 0}}});

  if(!getForRlfHero){
    return res.status(400).json({
      message: "Data is not found",
      success: false
    })
  }

  return res.status(200).json({
    message: "Data found Successfully!!",
    success: true,
    data: getForRlfHero[fieldName]
  })

  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false
    })
  }
}