const API_URL = "http://localhost:3000"
/** @typedef {Object} Product 
 *  @property {number} id 
 *  @property {string} name 
 *  @property {number} price 
 *  @property {number} stock 
 *  @property {string} description */

/**
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{total: number, products: Product[]}|undefined>}
 */
export async function getPaginatedProducts(page, limit, name = "") {
    try {
        const response = await fetch(`${API_URL}/products?name_like=${name}&_page=${page}&_limit=${limit}`)
        if (!response.ok) throw new Error("error fetching products");
        const data = await response.json()
        if (!data) throw new Error("products are empty")
        return {
            total: Number(response.headers?.get("X-Total-Count")),
            products: data
        }
    } catch (error) {
        console.error("error getting products:", error);
        return undefined
    }
}
/**@returns {Promise<Product[]|undefined>} */
export async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`)
        if (!response.ok) throw new Error("Error fetching products");
        const data = await response.json()
        if (!data || data.length === 0) throw new Error("Products are empty");
        return data
    } catch (error) {
        console.error("Error", error);
        return undefined
    }
}
/**
 * @param {Omit<Product, "id">} product
 * @returns { @returns {Promise<Product|undefined>}}
 */
export async function createProduct(product) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
        if (!response.ok) throw new Error("Error creating Product");
        const newObj = await response.json()
        if (!newObj) throw new Error("Object empty")
        return newObj
    } catch (error) {
        console.error("Error:", error);
        return undefined
    }
}
/**
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error("Error deleting product")
        return true
    } catch (error) {
        console.error("Error: ", error);
        return false
    }
}
/**
 * @param {number} id 
 * @param {Partial<Omit<Product, "id">>} updates 
 * @returns {Promise<Product|undefined>}
 */
export async function updateProduct(id, updates) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
        if (!response.ok) throw new Error("Error updatign product");
        const data = await response.json()
        if (!data) throw new Error("Product to update is empty")
        return data

    } catch (error) {
        console.error("Error:", error);
        return undefined
    }
}
/**
 * 
 * @param {number} id
 * @returns {Promise<Product|undefined>} 
 */
export async function getProductById(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`)
        if (!response.ok) throw new Error("Cant get product")
        return await response.json() || undefined
    } catch (error) {
        console.log(error);
        return undefined
    }
}
/**
 * 
 * @param {string} name 
 * @returns {Promise <Product| undefined>}
 */
export async function productExists(name) {
    const products = await getProducts()
    return products.find(
        p => p.name.trim().toLowerCase() === name.trim().toLowerCase())
}
