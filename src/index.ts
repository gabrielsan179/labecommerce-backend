import {
    getAllUsers,
    getAllProducts,
    createUser,
    createProduct,
    createPurchase,
    queryProductsByName,
    getProductById,
    getAllPurchasesFromUserId,
    deleteUserById,
    deleteProductById,
    editUserById,
    editProductById,
    users,
    products,
    getUsertById
} from './database';
import { CATEGORY } from './types';
import express, { Request, Response } from 'express';
import cors from 'cors';

console.log("Aplicativo foi iniciado")

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).send(getAllUsers())
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.get('/products', (req: Request, res: Response) => {
    try {
        res.status(200).send(getAllProducts())
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.get('/products/search', (req: Request, res: Response) => {
    try {
        const q = req.query.q as string
        if (!q) {
            res.status(404)
            throw new Error("'query params' não foi definida")
        }
        res.status(200).send(queryProductsByName(q))
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.get('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        res.status(200).send(getProductById(id))
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        res.status(200).send(getAllPurchasesFromUserId(id))
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.post('/users', (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const email = req.body.email
        const password = req.body.password
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        users.map((user) => {
            if (user.id === id) {
                res.status(400);
                throw new Error("Já existe usuario com ID informada");
            }
        })
        if (!email) {
            res.status(404)
            throw new Error("Email obrigatório para cadastro")
        }
        if (typeof email !== "string") {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        users.map((user) => {
            if (user.email === email) {
                res.status(400);
                throw new Error("Já existe usuario com email informada");
            }
        })
        if (!password) {
            res.status(404)
            throw new Error("Password obrigatório para cadastro")
        }
        if (typeof password !== "string") {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        createUser(id, email, password)
        res.status(201).send('Cadastro realizado com sucesso!')
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.post('/products', (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price
        const category = req.body.category as CATEGORY
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        products.map((product) => {
            if (product.id === id) {
                res.status(400);
                throw new Error("Já existe produto com ID informada");
            }
        })
        if (!name) {
            res.status(404)
            throw new Error("Nome do produto obrigatório para cadastro")
        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("Nome do produto precisa ser uma string")
        }
        if (!price) {
            res.status(404)
            throw new Error("Preço do produto obrigatório para cadastro")
        }
        if (typeof price !== "number") {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        if (!category) {
            res.status(404)
            throw new Error("Categoria do produto obrigatório para cadastro")
        }
        if (typeof category !== "string") {
            res.status(400)
            throw new Error("Categoria do produto precisa ser uma string")
        }
        if (category !== CATEGORY.FUTEBOL && category !== CATEGORY.FUTVOLEI && category !== CATEGORY.BASQUETE) {
            res.status(400)
            throw new Error(`Categoria do produto invalida \nCategorias validas são:\n"${CATEGORY.FUTEBOL}"\n"${CATEGORY.FUTVOLEI}"\n"${CATEGORY.BASQUETE}"`)
        }
        createProduct(id, name, price, category)
        res.status(201).send('Produto cadastrado com sucesso!')
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.post('/purchases', (req: Request, res: Response) => {
    try {
        const userId = req.body.userId
        const productId = req.body.productId
        const quantity = req.body.quantity
        if (!userId) {
            res.status(404)
            throw new Error("ID do usuario obrigatória para compra")
        }
        if (typeof userId !== "string") {
            res.status(400)
            throw new Error("ID do usuario precisa ser uma string")
        }
        if (!getUsertById(userId)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (!productId) {
            res.status(404)
            throw new Error("ID do produto obrigatória para compra")
        }
        if (typeof productId !== "string") {
            res.status(400)
            throw new Error("ID do produto precisa ser uma string")
        }
        const productExists = getProductById(productId)
        if (!productExists) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        if (!quantity) {
            res.status(404)
            throw new Error("Quantidade do produto obrigatório para compra")
        }
        if (typeof quantity !== "number") {
            res.status(400)
            throw new Error("Quantidade do produto precisa ser um number")
        }
        const totalPrice = productExists.price * quantity as number
        createPurchase(userId, productId, quantity, totalPrice)
        res.status(201).send('Compra realizada com sucesso!')
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        deleteUserById(id)
        res.status(200).send("Usuário desligado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.delete('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        deleteProductById(id)
        res.status(200).send("Produto desligado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.put('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const newEmail = req.body.email
        const newPassword = req.body.password
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (typeof newEmail !== "string" && newEmail) {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        users.map((user) => {
            if (user.email === newEmail) {
                res.status(400);
                throw new Error("Já existe usuario com email informada");
            }
        })
        if (typeof newPassword !== "string" && newPassword) {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        editUserById(id, newEmail, newPassword)
        res.status(200).send("Cadastro atualizado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.put('/products/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const newName = req.body.name
        const newPrice = req.body.price as number | undefined
        const newCategory = req.body.category as CATEGORY | undefined
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        if (typeof newName !== "string" && newName) {
            res.status(400)
            throw new Error("Nome do produto precisa ser uma string")
        }
        if (typeof newPrice !== "number" && newPrice) {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        if (typeof newCategory !== "string") {
            res.status(400)
            throw new Error("Categoria do produto precisa ser uma string")
        }
        if (newCategory !== CATEGORY.FUTEBOL && newCategory !== CATEGORY.FUTVOLEI && newCategory !== CATEGORY.BASQUETE && newCategory) {
            res.status(400)
            throw new Error(`Categoria do produto invalida \nCategorias validas são:\n"${CATEGORY.FUTEBOL}"\n"${CATEGORY.FUTVOLEI}"\n"${CATEGORY.BASQUETE}"`)
        }
        editProductById(id, newName, newPrice, newCategory)
        res.status(200).send("Produto atualizado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})