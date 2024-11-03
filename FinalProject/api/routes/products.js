import exress from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = exress.Router();

//create
router.post("/:cathid",verifyAdmin, createProduct)

//update

router.put("/:id",verifyAdmin, updateProduct)

//delete

router.delete("/:id/:cathid",verifyAdmin,deleteProduct)
//get
router.put("/:id", getProduct)
//get all

router.get("/", getProducts)



export default router