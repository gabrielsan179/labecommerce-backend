import { purchases, users, products, createUser, getAllUsers, createProduct, getAllProducts, getProductById, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from './database';
import { CATEGORY } from './types';

console.log("Aplicativo foi iniciado")

console.log(users)
console.log(products)
console.log(purchases)
console.log(createUser("u003", "rute@labe.com", "r123456"))
console.log(getAllUsers())
console.log(createProduct("p003", "Bola de Basquete", 80, CATEGORY.BASQUETE))
console.log(getAllProducts())
console.log(getProductById("p003"))
console.log(getProductById("p004"))
console.log(queryProductsByName("bola"))
console.log(createPurchase("u003", "p003", 2, 160))
console.log(createPurchase("u003", "p002", 2, 120))
console.log(getAllPurchasesFromUserId("u003"))