export type TUser = {
    id: string
    email: string
    password: string
}

export enum CATEGORY {
    FUTEBOL = "futebol",
    FUTVOLEI = "futvolei",
    BASQUETE = "basquete",
    VOLEI = "volei",
    HANDEBOL = "handebol",
    TENIS = "tenis"
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