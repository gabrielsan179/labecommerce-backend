export type TUser = {
    id: string
    email: string
    password: string
}

export enum CATEGORY {
    FUTEBOL = "Futebol",
    FUTVOLEI = "Futvolei",
    BASQUETE = "Basquete"
}

export type TProduct = {
    id: string
    name: string
    price: number
    category: CATEGORY
}

export type TPurchase = {
    userId: string
    productId: string
    quantity: number
    totalPrice: number
}