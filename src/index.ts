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
    editProductById
} from './database';
import { CATEGORY } from './types';
import express, { Request, Response} from 'express';
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

app.get('/users', (req:Request, res:Response) => {
    res.status(200).send(getAllUsers())
})

app.get('/products', (req:Request, res:Response) => {
    res.status(200).send(getAllProducts())
})

app.get('/products/search', (req:Request, res:Response) => {
    const q = req.query.q as string
    res.status(200).send(queryProductsByName(q))
})

app.post('/users', (req:Request, res:Response) => {
    const id = req.body.id as string
    const email = req.body.email as string
    const password = req.body.password as string
    createUser(id, email, password)
    res.status(201).send('Cadastro realizado com sucesso!')
})

app.post('/products', (req:Request, res:Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const category = req.body.category as CATEGORY
    createProduct(id, name, price, category)
    res.status(201).send('Produto cadastrado com sucesso!')
})

app.post('/purchases', (req:Request, res:Response) => {
    const userId = req.body.userId as string
    const productId = req.body.productId as string
    const quantity = req.body.quantity as number
    const totalPrice = req.body.totalPrice as number
    createPurchase(userId, productId, quantity, totalPrice)
    res.status(201).send('Compra realizada com sucesso!')
})

app.get('/products/:id', (req:Request, res:Response) => {
    const id = req.params.id as string
    res.status(200).send(getProductById(id))

})

app.get('/users/:id/purchases', (req:Request, res:Response) => {
    const id = req.params.id as string
    res.status(200).send(getAllPurchasesFromUserId(id))
})

app.delete('/users/:id', (req:Request, res:Response) => {
    const id = req.params.id as string
    deleteUserById(id)
    res.status(200).send("Usuário desligado com sucesso")
})

app.delete('/products/:id', (req:Request, res:Response) => {
    const id = req.params.id as string
    deleteProductById(id)
    res.status(200).send("Produto desligado com sucesso")
})

app.put('/users/:id', (req:Request, res:Response)=>{
    const id = req.params.id as string
    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined
    editUserById(id, newEmail, newPassword)
    res.status(200).send("Cadastro atualizado com sucesso")
})

app.put('/products/:id', (req:Request, res:Response)=>{
    const id = req.params.id as string
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as CATEGORY | undefined
    editProductById(id, newName, newPrice, newCategory)
    res.status(200).send("Produto atualizado com sucesso")
})