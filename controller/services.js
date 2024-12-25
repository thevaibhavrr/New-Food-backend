const Service = require("../model/service");
const Product = require("../model/products");
const createService = async (req, res) => {
    try {
        const { name, image } = req.body;
        const service = new Service({ name, image });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await Service.findByIdAndDelete(id);
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, active } = req.body;
        const service = await Service.findByIdAndUpdate(id, { name, image,active }, { new: true });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getservicebyid = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// product

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category")
        res.status(200).json({products , totalProducts:products.length});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category");
        res.status(200).json({product});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getproductsbyserviceid = async (req, res) => {
    try {
      const { name } = req.params;
       
      // Case insensitive search for service by name
      const service = await Service.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
  
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      // Finding products by category ID
      const products = await Product.find({ category: service._id, active:"true"  });
  
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
    createService,
    getAllServices,
    getproductsbyserviceid,
    deleteService,
    updateService,
    createProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
    getProductById,
    getservicebyid
};