import path from "path";
import fs from "fs";
import Products from "../schema/product.schema.js";
import { productPath } from "../middleware/product.multer.middleware.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Products.find({});

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
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

    const products = await Products.find({
      $or: [
        { brand: { $regex: q, $options: "i" } },
        { productName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { kind: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    if (!products) {
      return res.status(404).json({
        message: "Products not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Searched Products",
      data: products,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const filterController = async (req,res) => {
  try{
    const {cat,kind} = req.params;
    const {type} = req.query;
    
    if(!cat && !kind && !type) {
      return res.status(400).json({
        message:"cat is empty",
        success: false
      })
    }



    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      category: new RegExp(`^${escapeRegex(cat.trim())}$`, "i"),
      kind: new RegExp(`^${escapeRegex(kind.trim())}$`, "i"),
    };



    if (type && type.trim()) {
    query.productName = new RegExp(escapeRegex(type.trim()), "i");
    }

 
 
    const FilteredProducts = await Products.find(query).sort({createdAt: -1})

    if(!FilteredProducts){
      return res.status(404).json({
        message:"product is empty",
        data: FilteredProducts,
        success: false
      })
    }

    return res.status(200).json({
      message: "Successfully filtered",
      data: FilteredProducts,
      success: true
    })


  }catch(err){
    res.status(500).json({
      message: err.message,
      success: false
    })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, kind } = req.params;

    if (!category || !kind) {
      return res.status(400).json({
        message: "Params are empty",
        success: false,
      });
    }

   const capitalizedKind = kind
  .toLowerCase()
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

  const capitalizedCategory= category
  .toLowerCase()
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

    
    const productByCategory = await Products.find({ category: capitalizedCategory, kind: capitalizedKind });
  
    if (!productByCategory) {
      return res.status(404).json({
        message: `No product found by ${kind}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Product successfully found by ${kind}`,
      data: productByCategory,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
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

    const products = await Products.find({ productName: productName });

    if (!products || products.length === 0) {
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
    return res.status(500).json({
      message: err.message,
      success: false,
    });
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
    return res.status(500).json({
      message: err.message,
      success: false,
    });
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
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

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
    res.status(500).json({
      message: err.message || "Failed to Delete!",
      success: false,
    });
  }
};

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
      updatedProduct,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};


const moveIntoProductFolder = (file, category, kind, product, subFolder) => {
  const targetDir = path.join(productPath, category, kind, product, subFolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, path.basename(file.path));
  fs.renameSync(file.path, targetPath);

  const relativePath = path.relative(productPath, targetPath);
  return "products/" + relativePath.split(path.sep).join("/");
};

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
      stock
    } = req.body;


    const slideImageFiles = req.files?.slideImage || [];
    const colorImageFile = req.files?.colorImage?.[0];
    const lookImageFile = req.files?.lookImage?.[0];


    if (slideImageFiles.length === 0 && !colorImageFile && !lookImageFile) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    if (!category || !kind || !product) {
      return res.status(400).json({
        success: false,
        message: "category, kind and productName are required",
      });
    }

    const slideImagePaths = slideImageFiles.map((file) =>
      moveIntoProductFolder(file, category, kind, product, "slide")
    );
    const colorImagePath = colorImageFile
      ? moveIntoProductFolder(colorImageFile, category, kind, product, "colors")
      : null;
    const lookImagePath = lookImageFile
      ? moveIntoProductFolder(lookImageFile, category, kind, product, "look")
      : null;


    let productUploaded = await Products.findOne({
      category,
      kind,
      productName: product,
      colorName: color,
    });

    if (!productUploaded) {

      if (!colorImagePath) {
        return res.status(400).json({
          message: "Color image is required for the first upload of a new product!",
          success: false,
        });
      }

      let parsedSizes = sizesAvailable;
      if (typeof sizesAvailable === "string") {
        try {
          parsedSizes = JSON.parse(sizesAvailable);
        } catch {
          parsedSizes = sizesAvailable.split(",").map((s) => s.trim());
        }
      }

      productUploaded = await Products.create({
        category,
        kind,
        productName: product,
        brand,
        colorName: color,
        colorImage: colorImagePath,
        price: Number(price),
        stock,
        sizesAvailable: parsedSizes,
        description,
        trending: trending === "true" || trending === true,
        slideImage: slideImagePaths,
        lookImage: lookImagePath || "",
      });
    } else {
      if (slideImagePaths.length > 0) {
        productUploaded.slideImage.push(...slideImagePaths);
      }
      if (lookImagePath) {
        productUploaded.lookImage = lookImagePath;
      }
      await productUploaded.save();
    }

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully!",
      data: productUploaded,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Id missing, can't be edited",
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

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getproductsForGuestBag = async (req, res) => {
  try {
    const { products } = req.query;

    const favItems = Array.isArray(products) ? products : [products];

    if (!Array.isArray(favItems)) {
      return res.status(400).json({
        message: "guestBag is not an Array",
        success: false,
      });
    }

    const GuestBag = await Products.find({ productName: { $in: favItems } });

    return res.status(200).json({
      message: "Found for Guest",
      data: GuestBag,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};


export const getProductByKind = async (req, res) => {
  try {
    const { kind } = req.params;
   


    const products = await Products.find({ kind});

  
    if (!products || products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No products found for this kind." 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};


export const getMatchedProducts = async (req,res) => {
  const {match } = req.query;
  const { category } = req.params;

  if(!match){
    return res.status(400).json({
      message:"query is undefined",
      success: false
    })
  }
  const matchArray = match.split(',');

  const isProducts = await Products.find({
    category: category,
    kind: {$nin: matchArray}
  })

  if(!isProducts || isProducts.length === 0){
    return res.status(404).json({
      message: "products are not found",
      success: false
    })
  }


  return res.status(200).json({
    message:"Matched Products are found!",
    data: isProducts,
    success: true
  })
}

