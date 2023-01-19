import { 
    users, 
    products, 
    purchases, 
    createUser,
    createProduct, 
    createPurchase, 
    queryProductsByName,
    getAllUsers, 
    getAllProducts, 
    getProductById, 
    getAllPurchasesFromUserId 
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
    res.status(200).send(users)
})

app.get('/products', (req:Request, res:Response) => {
    res.status(200).send(products)
})

app.get('/purchases', (req:Request, res:Response) => {
    res.status(200).send(purchases)
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
