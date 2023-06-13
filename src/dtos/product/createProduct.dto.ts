import z from "zod"
import { ProductModel } from "../../models/Product"
import { TokenPayloadProduct } from "../../services/TokenManager"

export interface CreateProductInputDTO {
  name: string,
  price: number
}

export interface CreateProductOutputDTO {
  message: string,
  product: string
}

export const CreateProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().gt(0)
}).transform(data => data as CreateProductInputDTO)