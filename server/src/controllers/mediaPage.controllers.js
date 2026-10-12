import path from "path";
import PartForWebPage from '../schema/mediaForPage.schema.js'


export const uploadMediaToPage = async (req,res) => {
  try{
   const {nav, part} = req.params;
   const {brand, title, description, forMobile} = req.body;
  
   if(!req.files || req.files.length === 0){
    return res.status(400).json({
        message: "No files uploaded",
        success: false
    })
   }

    const validParts = ["carousel", "stories", "category","trend","explore"];

    if(!validParts.includes(part)){
      return res.status(400).json({
        message: "Invalid Part",
        success: false
      })
    }

   const pageMediaPath = path.join(process.cwd(), "MediaForPage", nav, part);

   const mediaRelativePath = req.files.map((file) => {
    const toRelative = path.relative(pageMediaPath, file.path);
    return  `/media/${toRelative.split(path.sep).join('/')}`;
   });

   const info = {
    media: mediaRelativePath,
    brand: brand,
    title: title,
    description: description,
    forMobile: forMobile === 'true' || forMobile === true
   } 

  

   let MediaPageExists = await PartForWebPage.findOne({nav});

   if(!MediaPageExists){
     MediaPageExists = await PartForWebPage.create({
      nav: nav,
      part: [
        {
        carousel : part === "carousel" ? [info] : [],
        stories : part === "stories" ? [info] : [],
        category: part === "category" ? [info] : []
      }
    ]
   });
     } else {
      const firstPart = MediaPageExists.part[0];
      firstPart[part].push(info);

      await MediaPageExists.save();
    }

   return res.status(201).json({
    message: "Media uploaded Successfully🚀",
    success: true,
    data: MediaPageExists
   });

   }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false
    })
  }
}

export const getForMenGrid = async (req,res) => {
  try{
  const {nav, part} = req.params;
  
  if(!nav || !part){
    return res.status(400).json({
      message: "Params are invalid",
      success: true
    })
  }

  const isMenGrid = await PartForWebPage.findOne({nav});
  if(!isMenGrid || !isMenGrid.part || isMenGrid.length === 0){
    return res.status(404).json({
      message: "Not found in the backend",
      success: false
    })
  }

  const partData = isMenGrid.part[0][part] || [];

  return res.status(200).json({
    message: "Here is your data for your component",
    data: partData,
    success: true
  })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false
    })
  }
}




