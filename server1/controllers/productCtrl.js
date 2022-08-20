const Products = require("../models/Product");
const Comments = require("../models/Comment");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getAllProduct: async (req, res) => {
    try {
      const productLength = new APIfeatures(
        Products.find(),
        req.query
      ).filtering();
      const lengthProduct = await productLength.query;

      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.status(200).json({
        count: lengthProduct.length,
        success: true,
        products,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  detailProduct: async (req, res) => {
    console.log(req.params.id)
    const product = await Products.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  },
  createProduct: async (req, res) => {
    try {
      // check xem đã có sản phẩm chưa có thì chỉ cần update số lượng
      const product = await Products.findOne({ name: req.body.name });
      if (product) {
        let updatedQuantity = {
          quantity: product.quantity + req.body.quantity,
        };
        const quantityUpdateCondition = { _id: product._id };
        updatedQuantity = await Products.findOneAndUpdate(
          quantityUpdateCondition,
          updatedQuantity,
          { new: true }
        );

        if (!updatedQuantity)
          return res.status(401).json({
            success: false,
            message: "product not found",
          });
      }
    
      //không có thì thêm mới
      const {
        name,
        category,
        nsx,
        quantity,
        price,
        color,
        discount,
        description,
      } = req.body;
      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      const newProduct = new Products({
        name,
        category,
        nsx,
        quantity,
        price,
        color,
        description,
        discount,
        images: imagesLinks,
      });
      await newProduct.save();
      return res.status(200).json({
        success: true,
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  updateProduct: async (req, res) => {
    const {
      name,
      category,
      nsx,
      quantity,
      price,
      color,
      discount,
      description,
    } = req.body;

    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    try {
      let updatedProduct = {
        name,
        category,
        nsx,
        quantity,
        price,
        color,
        description,
        discount,
        images: imagesLinks,
      };

      const productUpdateCondition = { _id: req.params.id };
      updatedProduct = await Products.findOneAndUpdate(
        productUpdateCondition,
        updatedProduct,
        { new: true }
      );

      if (!updatedProduct)
        return res.status(401).json({
          success: false,
          message: "product not found",
        });

      return res.json({
        success: true,
        message: "Excellent progress!",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const commentDeleteCondition = { id_product: req.params.id };
      if (commentDeleteCondition) {
        await Comments.findOneAndDelete(commentDeleteCondition);
      }
      const productDeleteCondition = { _id: req.params.id };
      if (!productDeleteCondition)
        return res.status(401).json({
          success: false,
          message: "khong ton tai product",
        });
      await Products.findOneAndDelete(productDeleteCondition);
      return res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
module.exports = productCtrl;
