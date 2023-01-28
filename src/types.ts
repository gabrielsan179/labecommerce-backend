
export type TUser = {
    id: string
    name: string
    email: string
    password: string
    create_at: string
}

export type TUserForCreation = {
    id: string
    name: string
    email: string
    password: string
}

export type TProduct = {
    id: string
    name: string
    price: number
    description: string
    image_url: string 
}

export type TPurchase = {
    id: string
    buyer: string
    total_price: number
    create_at: string
    paid: number
}

export type TPurchaseForCreation = {
    id: string
    buyer: string
    total_price: number
}

export type TPurchaseById = {
    id: string
    total_price: number
    create_at: string
    paid: number
    buyer: string
    name: string
    email: string
}

export type TProductList = {
    id: string
    name: string
    price: number
    description: string
    image_url: string 
    quantity: number
}

export type TPurchaseProducts = {
    id: string
    total_price: number
    create_at: string
    paid: number
    buyer: string
    name: string
    email: string
    productList: TProductList[]
}