import { db } from './database/knex';
import {
    getProductById,
    deleteUserById,
    deleteProductById,
    editUserById,
    editProductById,
    users,
    getUsertById,
    regexPassword,
    regexEmail
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

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/users', async (req: Request, res: Response) => {
    try {
        const allUsers = await db("users")
        res.status(200).send(allUsers)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products', async (req: Request, res: Response) => {
    try {
        const allProducts = await db("products")
        res.status(200).send(allProducts)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const allPurchases = await db("purchases")
        res.status(200).send(allPurchases)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products/search', async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string
        if (!q) {
            res.status(404)
            throw new Error("'query params' não foi definida")
        }
        const productsByName = await db("products")
        .where("name", "LIKE", `%${q}%`)

        res.status(200).send(productsByName)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [product] = await db("products")
        .where( "id", "=", `${id}`)
        if (!product) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        res.status(200).send(product)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [purchase] = await db("purchases")
        .where( "id", "=", `${id}`)
        if (!purchase) {
            res.status(400)
            throw new Error("ID da compra informada não foi encontrado")
        }
        const [purchasesById] = await db("purchases")
        .select(
            "purchases.id AS purchasesID",
            "purchases.total_price",
            "purchases.created_at AS created_at_purchases",
            "purchases.paid",
            "purchases.buyer AS buyerID",
            "users.name",
            "users.email"
        )
        .innerJoin("users","users.id", "=", "purchases.buyer")
        .where( "purchases.id", "=", `${id}`)
        const productsList = await db ("purchases")
        .select(
            "products.id",
            "products.name",
            "products.price",
            "products.description",
            "products.imageUrl",
            "purchases_products.quantity"
        )
        .innerJoin("purchases_products", "purchases_products.purchase_id", "=", "purchases.id")
        .innerJoin("products", "purchases_products.product_id", "=", "products.id")
        .where( "purchases.id", "=", `${id}`)

        res.status(200).send({...purchasesById, productsList})
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [userId] = await db("users")
        .where( "id", "=", `${id}`)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        const allPurchasesFromUserId = await db("purchases")
        .select(
            "purchases.id AS purchasesID",
            "purchases.total_price",
            "purchases.created_at AS created_at_purchases",
            "purchases.paid",
            "purchases.buyer AS buyerID",
            "users.name",
            "users.email"
        )
        .innerJoin("users", "users.id", "=", "purchases.buyer")
        .where( "users.id", "=", `${id}`)
        
        res.status(200).send(allPurchasesFromUserId)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, email, name, password } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const [userId] = await db("users")
        .where( "id", "=", `${id}`)
        if (userId) {
            res.status(400)
            throw new Error("Já existe usuario com ID informada")
        }
        if (!name) {
            res.status(404)
            throw new Error("Name obrigatório para cadastro")
        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("Name precisa ser uma string")
        }
        if (!email) {
            res.status(404)
            throw new Error("Email obrigatório para cadastro")
        }
        if (typeof email !== "string") {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        if (!email.match(regexEmail)) {
			throw new Error("Formato de email invalido")
		}
        const [userEmail] = await db("users")
        .where( "email", "=", `${email}`)
        if (userEmail) {
            res.status(400)
            throw new Error("Já existe usuario com email informada")
        }
        if (!password) {
            res.status(404)
            throw new Error("Password obrigatório para cadastro")
        }
        if (typeof password !== "string") {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        if (!password.match(regexPassword)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
        const newUser = {
            id,
            name,
            email,
            password
        }
        await db("users").insert(newUser)
        
        res.status(201).send('Cadastro realizado com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const [product] = await db("products")
        .where( "id", "=", `${id}`)
        if (product) {
            res.status(400);
            throw new Error("Já existe produto com ID informada");
        }
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
        if (!description) {
            res.status(404)
            throw new Error("Descrição do produto obrigatório para cadastro")
        }
        if (typeof description !== "string") {
            res.status(400)
            throw new Error("Descrição do produto precisa ser uma string")
        }
        if (typeof imageUrl !== "string") {
            res.status(400)
            throw new Error("URL de imagem do produto precisa ser uma string")
        }
        const newProduct = {
            id,
            name,
            price,
            description,
            imageUrl
        }
        await db("products").insert(newProduct)
        res.status(201).send('Produto cadastrado com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { id, buyer, total_price } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const purchase = await db("purchases")
        .where( "id", "=", `${id}`)
        if (purchase) {
            res.status(400);
            throw new Error("Já existe compra com ID informada");
        }
        if (!buyer) {
            res.status(404)
            throw new Error("ID do usuario obrigatória para compra")
        }
        if (typeof buyer !== "string") {
            res.status(400)
            throw new Error("ID do usuario precisa ser uma string")
        }
        const [userId] = await db("users")
        .where( "id", "=", `${buyer}`)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (!total_price) {
            res.status(404)
            throw new Error("Preço do produto obrigatório para cadastro")
        }
        if (typeof total_price !== "number") {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }

        const newPurchase = {
            id,
            buyer,
            total_price
        }
        await db("purchases").insert(newPurchase)
        res.status(201).send('Compra realizada com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        deleteUserById(id)
        res.status(200).send("Usuário desligado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        deleteProductById(id)
        res.status(200).send("Produto desligado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/users/:id', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/products/:id', async (req: Request, res: Response) => {
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
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})