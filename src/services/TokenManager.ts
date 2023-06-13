import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


export enum USER_ROLES {
    NORMAL = "Normal",
    ADMIN = "Admin"
}


export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}

export interface TokenPayloadProduct {
    id: string,
    name: string,
    price: number,
    createdAt: string
}

export class TokenManager {
    public createToken = (payload: TokenPayload) => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
        return token
    }
}

export class TokenManagerProduct {
    public createToken = (payload: TokenPayloadProduct) => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY_PRODUCT as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
        return token
    }
}