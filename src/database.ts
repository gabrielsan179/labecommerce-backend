import { TUser, TProduct, TPurchase } from './types';

export const users: TUser[] = [
    {
        id: "u001",
        email: "gabi@labe.com",
        password: "g123456"
    },
    {
        id: "u002",
        email: "lari@labe.com",
        password: "l123456"
    }
]

export const products: TProduct[] = [
    {
        id: "p001",
        name: "Bola de Futebol",
        price: 40.00,
        category: "Futebol"
    },
    {
        id: "p002",
        name: "Bola de Futvolei",
        price: 60.00,
        category: "Futvolei"
    }
]    

export const purchases: TPurchase[] = [
    {
        userId: users[0].id === "u001" ? "u001":"erro",
        productId: products[0].id === "p001" ? "p001" : "erro",
        quantity: 3,
        totalPrice: 3 * products[0].price
    },
    {
        userId: users[1].id === "u002" ? "u002":"erro",
        productId: products[1].id === "p002" ? "p002" : "erro",
        quantity: 3,
        totalPrice: 3 * products[1].price
    }
]