import { TUser, TProduct, TPurchase, CATEGORY } from './types';

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
        category: CATEGORY.FUTEBOL
    },
    {
        id: "p002",
        name: "Bola de Futvolei",
        price: 60.00,
        category: CATEGORY.FUTVOLEI
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

export const createUser = (id : string, email : string, password : string) : string => {
    users.push({
        id,
        email,
        password
    });
    return ("Cadastro realizado com sucesso")
}

export const getAllUsers = (): TUser[] => {
    return users
}

export const createProduct = (id : string, name : string, price : number, category : CATEGORY) : string => {
    products.push({
        id,
        name,
        price,
        category
    })
    return ("Produto criado com sucesso")
}

export const getAllProducts = () : TProduct[] => {
    return products
}

export const getProductById = (id : string) : (undefined | TProduct) => {
    return products.find((product) => product.id === id)
}

export const queryProductsByName = (q : string) : TProduct[] => {
    return products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
}

export const createPurchase = (userId : string, productId : string, quantity : number, totalPrice : number) : string => {
    purchases.push({
        userId,
        productId,
        quantity,
        totalPrice    
    })
    return ("Compra realizada com sucesso");
}

export const getAllPurchasesFromUserId = (userIdToSearch : string) : TPurchase[] => {
    return purchases.filter(purchase => purchase.userId === userIdToSearch);
}