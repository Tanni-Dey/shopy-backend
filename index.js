import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { Schema, model } from "mongoose";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//product schema
const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sellerSku: { type: String, unique: true, required: true },
  color: { type: String, required: true },
  size: { type: String, enum: ["large", "medium", "small"], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  stockStatus: {
    type: String,
    enum: ["stock-in", "stock-out"],
    required: true,
  },
  category: {
    type: String,
    enum: ["men", "women", "all wallets & small leather goods", "jewelry"],
    required: true,
  },
  subCategory: { type: String, required: true },
  available: { type: Boolean, required: true },
  version: { type: [String], required: true },
  nft: { type: Boolean, required: true },
  offprint: { type: Boolean, required: true },
  packageWeight: { type: Number, required: true },
  dimension: { type: String, required: true },
});

//product model
const Product = model("Product", productSchema);

//----------- all api start----------

// get all product api
const findProducts = async (req, res) => {
  const products = await Product.find({});
  res.send(products);
};

//add product api
const addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.send(product);
};

//get single product by id
const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  res.send(product);
};

//----------- all api end----------

//router setup
const routes = Router();
app.use("/api", routes);

// all route
routes.get("/products", findProducts);
routes.post("/add-product", addProduct);
routes.get("/product/:id", getSingleProduct);

//database connect function
async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.get("/", async (req, res) => {
      res.send("shopy");
    });
    app.listen(process.env.PORT, () => console.log("shopy backend connected"));
  } catch (err) {
    console.log(err);
  }
}
main();
