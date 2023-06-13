import { ProductDatabase } from "../database/ProductDatabase"
import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/product/createProduct.dto"
import { GetProductsInputDTO, GetProductsOutputDTO } from "../dtos/product/getProducts.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { Product, ProductModel } from "../models/Product"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManagerProduct, TokenPayloadProduct } from "../services/TokenManager"

export class ProductBusiness {
  constructor(
    private productDatabase: ProductDatabase,
    private idGenerator: IdGenerator,
    private tokenManagerProduct: TokenManagerProduct
  ) { }

  public getProducts = async (
    input: GetProductsInputDTO
  ): Promise<GetProductsOutputDTO> => {
    const { q } = input

    const productsDB = await this.productDatabase.findProducts(q)

    const products = productsDB.map((productDB) => {
      const product = new Product(
        productDB.id,
        productDB.name,
        productDB.price,
        productDB.created_at
      )

      return product.toBusinessModel()
    })

    const output: GetProductsOutputDTO = products

    return output
  }

  public createProduct = async (
    input: CreateProductInputDTO
  ): Promise<CreateProductOutputDTO> => {
    const { name, price } = input

    const id = await this.idGenerator.generate()

    const productDBExists = await this.productDatabase.findProductById(id)

    if (productDBExists) {
      throw new BadRequestError("'id' já existe")
    }

    const newProduct = new Product(
      id,
      name,
      price,
      new Date().toISOString()
    )

    const newProductDB = newProduct.toDBModel()
    await this.productDatabase.insertProduct(newProductDB)

    const tokenPayload: TokenPayloadProduct = {
      id: newProduct.getId(),
      name: newProduct.getName(),
      price: newProduct.getPrice(),
      createdAt: newProduct.getCreatedAt()
    }

    const token = await this.tokenManagerProduct.createToken(tokenPayload)

    const output: CreateProductOutputDTO = {
      message: "Producto cadastrado com sucesso",
      product: token
    }

    return output
  }
}