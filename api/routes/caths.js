import exress from "express";
import Cath from "../models/Cath.js";
import { createCath, deleteCath, getCath, getCaths, updateCath } from "../controllers/cath.js";
import {verifyAdmin} from "../utils/verifyToken.js"
const router = exress.Router();

//create
router.post("/",verifyAdmin, createCath)

//update

router.put("/:id",verifyAdmin,updateCath)

//delete
router.delete("/:id/:cathid",verifyAdmin,deleteCath)
//get
router.put("/:id", getCath)

router.get("/find/:id", getCath);

//get all
router.get("/", getCaths)


export default router