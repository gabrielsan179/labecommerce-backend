import { db } from './database/knex';
import {
    regexPassword,
    regexEmail
} from './database';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { TProduct, TPurchase, TUser, TProductList, TPurchaseProducts, TPurchaseById, TUserForCreation, TPurchaseForCreation } from './types';

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
        const q = req.query.q as string | undefined
        const [user] : TUser[] | undefined[] = await db("users")
        .where("name", "LIKE", `%${q}%`)
        if (user) {
            const userByName : TUser[] = await db("users")
                .select(
                    "id",
                    "name",
                    "email",
                    "password",
                    "created_at AS createdAt"
                )
                .where("name", "LIKE", `%${q}%`)
            res.status(200).send(userByName)
        } else {
            const allUsers : TUser[] = await db("users")
                .select(
                    "id",
                    "name",
                    "email",
                    "password",
                    "created_at AS createdAt"
                )
            res.status(200).send(allUsers)
        }
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
        const q = req.query.q as string | undefined
        const [product] : TProduct[] | undefined[] = await db("products")
        .where("name", "LIKE", `%${q}%`)
        if (product) {
            const productsByName : TProduct[] = await db("products")
                .select(
                    "id",
                    "name",
                    "price",
                    "description",
                    "image_url AS imageUrl"
                )
                .where("name", "LIKE", `%${q}%`)
            res.status(200).send(productsByName)
        } else {
            const allProducts : TProduct[] = await db("products")
                .select(
                    "id",
                    "name",
                    "price",
                    "description",
                    "image_url AS imageUrl"
                )
            res.status(200).send(allProducts)
        }
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
        const allPurchases : TPurchase[] = await db("purchases")
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

app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string | undefined
        const [user] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${id}`)
        if (!user) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        res.status(200).send(user)
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
        const id = req.params.id as string | undefined
        const [product] : TProduct[] | undefined[] = await db("products")
            .where("id", "=", `${id}`)
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
        const id = req.params.id as string | undefined
        const [purchase] : TPurchase[] | undefined[] = await db("purchases")
            .where("id", "=", `${id}`)
        if (!purchase) {
            res.status(400)
            throw new Error("ID da compra informada não foi encontrado")
        }
        const [purchasesById] : TPurchaseById[] = await db("purchases")
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
            .where("purchases.id", "=", `${id}`)
        const productsList : TProductList[] = await db("purchases")
            .select(
                "products.id",
                "products.name",
                "products.price",
                "products.description",
                "products.image_url AS imageURL",
                "purchases_products.quantity"
            )
            .innerJoin("purchases_products", "purchases_products.purchase_id", "=", "purchases.id")
            .innerJoin("products", "purchases_products.product_id", "=", "products.id")
            .where("purchases.id", "=", `${id}`)

        res.status(200).send({ ...purchasesById, productsList})
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
        const id = req.params.id as string | undefined
        const [userId] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${id}`)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        const allPurchasesFromUserId : TPurchaseById[] = await db("purchases")
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
            .where("users.id", "=", `${id}`)

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
        const [userId] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${id}`)
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
        const [userEmail] : TUser[] | undefined[] = await db("users")
            .where("email", "=", `${email}`)
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
        const newUser : TUserForCreation = {
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
        const [product] : TProduct[] | undefined[] = await db("products")
            .where("id", "=", `${id}`)
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
        const newProduct : TProduct = {
            id,
            name,
            price,
            description,
            image_url: imageUrl
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
        const { id, buyer, totalPrice, products } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const [purchase]  : TPurchase[] | undefined[] = await db("purchases")
            .where("id", "=", `${id}`)
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
        const [userId] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${buyer}`)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (!totalPrice) {
            res.status(404)
            throw new Error("Preço do produto obrigatório para cadastro")
        }
        if (typeof totalPrice !== "number") {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        for (let product of products) {
            const [productExist] : TProduct[] | undefined[] = await db("products")
                .where("id", "=", `${product.id}`)
            if (!productExist) {
                res.status(400)
                throw new Error(`ID "${product.id}" do produto informada não foi encontrado`)
            }
        }
        const newPurchase : TPurchaseForCreation = {
            id,
            buyer,
            total_price: totalPrice
        }
        await db("purchases").insert(newPurchase)
        products.map(async (product: TProductList) => {
            const newPurchaseProduct = {
                purchase_id: id,
                product_id: product.id,
                quantity: product.quantity
            }
            await db("purchases_products").insert(newPurchaseProduct)
        })
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
        const id = req.params.id as string | undefined
        const [user] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${id}`)
        if (!user) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        const purchases : TPurchase[] = await db("purchases")
            .where("buyer", "=", `${id}`)
        purchases.map(async(purchase : TPurchase)=>{
            await db("purchases_products").del().where("purchase_id", "=", `${purchase.id}`)
        })
        await db("purchases").del().where("buyer", "=", `${id}`)
        await db("users").del().where("id", "=", `${id}`)
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
        const id = req.params.id as string | undefined
        const [product] : TProduct[] | undefined[] = await db("products")
            .where("id", "=", `${id}`)
        if (!product) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        await db("purchases_products").del().where("product_id", "=", `${id}`)
        await db("products").del().where("id", "=", `${id}`)
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

app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [purchase] : TPurchase[] | undefined[] = await db("purchases")
            .where("id", "=", `${id}`)
        if (!purchase) {
            res.status(400)
            throw new Error("ID da compra informada não foi encontrado")
        }
        await db("purchases_products").del().where("purchase_id", "=", `${id}`)
        await db("purchases").del().where("id", "=", `${id}`)

        res.status(200).send("Pedido cancelado com sucesso")
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
        const newName = req.body.name as string
        const newEmail = req.body.email as string
        const newPassword = req.body.password as string
        const [user] : TUser[] | undefined[] = await db("users")
            .where("id", "=", `${id}`)
        if (!user) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (typeof newName !== "string" && newName) {
            res.status(400)
            throw new Error("Name precisa ser uma string")
        }
        if (typeof newEmail !== "string" && newEmail) {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        if (!newEmail.match(regexEmail)) {
            throw new Error("Formato de email invalido")
        }
        const [userEmail] : TUser[] | undefined[] = await db("users")
            .where("email", "=", `${newEmail}`)
        if (userEmail) {
            res.status(400)
            throw new Error("Já existe usuario com email informada")
        }
        if (typeof newPassword !== "string" && newPassword) {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        if (!newPassword.match(regexPassword)) {
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }
        const updatedUser : TUserForCreation = {
            id,
            name: newName || user.name,
            email: newEmail || user.email,
            password: newPassword || user.password
        }
        await db("users").update(updatedUser).where("id", "=", `${id}`)
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
        const newId = req.body.id as string
        const newName = req.body.name as string
        const newPrice = req.body.price as number
        const newDescription = req.body.description as string
        const newImageUrl = req.body.imageUrl as string

        const [product] : TProduct[] | undefined[] = await db("products")
            .where("id", "=", `${id}`)
        if (!product) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        if (typeof newId !== "string" && newId) {
            res.status(400)
            throw new Error("id do produto precisa ser uma string")
        }
        if (typeof newName !== "string" && newName) {
            res.status(400)
            throw new Error("Nome do produto precisa ser uma string")
        }
        if (typeof newPrice !== "number" && newPrice) {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        if (typeof newDescription !== "string" && newDescription) {
            res.status(400)
            throw new Error("Descrição do produto precisa ser uma string")
        }
        if (typeof newImageUrl !== "string" && newImageUrl) {
            res.status(400)
            throw new Error("URL da imagem do produto precisa ser uma string")
        }
        const [purchasesProductsExist] : TPurchase[] | undefined[] = await db("purchases_products")
            .where("product_id", "=", `${id}`)
        if (purchasesProductsExist) {
            const newProduct : TProduct = {
                id: newId || product.id,
                name: newName || product.name,
                price: isNaN(newPrice) ? product.price : newPrice,
                description: newDescription || product.description,
                image_url: newImageUrl || product.image_url
            }
            await db("products").insert(newProduct)
            await db("purchases_products")
                .update("product_id", `${newId}`)
                .where("product_id", "=", `${id}`)
            await db("products").del().where("id", "=", `${id}`)
            res.status(200).send("Produto atualizado com sucesso")
        } else {
            const updatedProduct : TProduct = {
                id: newId || product.id,
                name: newName || product.name,
                price: isNaN(newPrice) ? product.price : newPrice,
                description: newDescription || product.description,
                image_url: newImageUrl || product.image_url
            }    
            await db("products").update(updatedProduct).where("id", "=", `${id}`)
            res.status(200).send("Produto atualizado com sucesso")
        }
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