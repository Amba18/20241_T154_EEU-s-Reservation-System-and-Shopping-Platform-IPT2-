import Cath from "../models/Cath.js"
import Product from "../models/Product.js"

export const createCath = async(req,res,next)=>{

    const newCath = new Cath(req.body)
    try{
        const savedCath = await newCath.save()
        res.status(200).json(savedCath)
    }catch(err){

        next(err)

    }
}
export const updateCath = async(req,res,next)=>{

    try{
        const updatedCath = await Cath.findByIdAndUpdate(req.params.id,{$set:req.body},
        {new:true}
        )
        res.status(200).json(updatedCath)
    }catch(err){


        next(err)

    }
}
export const deleteCath = async(req,res,next)=>{

    try{
        await Cath.findByIdAndDelete(req.params.id
         )
         res.status(200).json("Category has been deleted")
     }catch(err){

        next(err)

    }
}
export const getCath = async(req,res,next)=>{

   
    try{
        const cath = await Cath.findById(req.params.id
        )
        res.status(200).json(cath)
    }catch(err){

        next(err)

    }
}
export const getCaths = async(req,res,next)=>{


    try{
        const caths = await Cath.find()
        res.status(200).json(caths)
    }catch(err){

        next(err)

    }
}
export const geCathProducts = async (req, res, next) => {
    try {
      const cath = await Cath.findById(req.params.id);
      const list = await Promise.all(
        cath.products.map((room) => {
          return Product.findById(product);
        })
      );
      res.status(200).json(list)
    } catch (err) {
      next(err);
    }
  };