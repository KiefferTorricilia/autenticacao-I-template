import express from "express"
import { ProductBusiness } from "../business/ProductBusiness"
import { ProductController } from "../controller/ProductController"
import { ProductDatabase } from "../database/ProductDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManagerProduct } from "../services/TokenManager"

export const productRouter = express.Router()

const productController = new ProductController(
    new ProductBusiness(
        new ProductDatabase(),
        new IdGenerator(),
        new TokenManagerProduct
    )
)

productRouter.get("/", productController.getProducts)
productRouter.post("/", productController.createProduct)