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
        const { id } = req.params; // Extract the service ID from the URL parameters.
        const { name, image, active, poistionId } = req.body; // Extract updated fields from the request body.
        // Update the service in the database and return the updated document.
        const service = await Service.findByIdAndUpdate(
            id,
            { name, image, active, poistionId },
            { new: true } // Ensures the returned document is the updated version.
        );

        res.status(200).json(service); // Respond with the updated service.
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors and respond with an error message.
    }
};

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
  

  const searchProducts = async (req, res) => {
    try {
        const { name, category } = req.query;

        // Build search query based on parameters
        let searchCriteria = { active: "true" }; // Default search for active products

        // If both name and category are provided
        if (name && category) {
            const service = await Service.findOne({
                name: { $regex: new RegExp('^' + category + '$', 'i') },
            });

            if (service) {
                searchCriteria = {
                    ...searchCriteria,
                    name: { $regex: new RegExp(name, 'i') },
                    category: service._id,
                };
            } else {
                searchCriteria = {
                    ...searchCriteria,
                    name: { $regex: new RegExp(name, 'i') },
                };
            }
        }
        // If only name is provided
        else if (name) {
            searchCriteria = {
                ...searchCriteria,
                name: { $regex: new RegExp(name, 'i') },
            };
        }
        // If only category is provided
        else if (category) {
            const service = await Service.findOne({
                name: { $regex: new RegExp('^' + category + '$', 'i') },
            });

            if (service) {
                searchCriteria = { ...searchCriteria, category: service._id };
            } else {
                // If category doesn't exist, return products from all categories
                searchCriteria = { ...searchCriteria };
            }
        }

        const products = await Product.find(searchCriteria).populate("category");

        res.status(200).json({ products, totalProducts: products.length });
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
    getservicebyid,
    searchProducts
};