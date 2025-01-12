const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("title price _id author thumbnail preview category userId")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            title: doc.title,
            price: doc.price,
            author: doc.author,
            thumbnail: doc.thumbnail,
            preview: doc.preview,
            category: doc.category,
            userId: doc.userId,
            _id: doc._id
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.categories_get_category = (req, res, next) => {
  console.log( req )
  Product.find({ category: req.body.category})
    .select("title price _id author thumbnail preview category userId")
    .exec()
    .then(docs => {
      console.log(docs)
      const response = {
        products: docs.map(doc => {
          return {
            title: doc.title,
            price: doc.price,
            author: doc.author,
            thumbnail: doc.thumbnail,
            preview: doc.preview,
            category: doc.category,
            userId: doc.userId,
            _id: doc._id
          };
        })
      };
      //   if (docs.length >= 0) {

      res.status(200).json(response);
      console.log(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log(req)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    thumbnail: req.files.thumbnail[0].filename,
    preview: req.files.preview[0].filename,
    category: req.body.category
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
          title: result.title,
          price: result.price,
          _id: result._id,
          userId: result.userId,
          author: result.author,
          thumbnail: result.thumbnail,
          preview: result.preview,
          category: result.category
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("title author price _id thumbnail preview")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
