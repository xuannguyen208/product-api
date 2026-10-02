const Product = require('../models/Product');

// CREATE - Thêm sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: 'Thêm sản phẩm thành công',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      message: 'Thêm sản phẩm thất bại',
      error: error.message
    });
  }
};

// READ ALL - Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      data: products
    });
  } catch (error) {
    res.status(500).json({
      message: 'Không thể lấy danh sách sản phẩm',
      error: error.message
    });
  }
};

// READ ONE - Tìm sản phẩm theo pid
exports.getProductByPid = async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      data: product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra',
      error: error.message
    });
  }
};

// UPDATE - Cập nhật sản phẩm theo pid
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      message: 'Cập nhật sản phẩm thất bại',
      error: error.message
    });
  }
};

// DELETE - Xóa sản phẩm theo pid
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Xóa sản phẩm thất bại',
      error: error.message
    });
  }
};