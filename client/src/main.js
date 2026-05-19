import "./styles/globals.css";
import { calculateRange, updatePaginationButtons } from "./utils/paginations";
import { calculateSummaries } from "./utils/summaries";
import generateInventoryLine from "./components/productLine";
import {
    createProduct,
    deleteProduct,
    getPaginatedProducts,
    getProductById,
    getProducts,
    productExists,
    updateProduct
} from "./requests/products";


import { debounce } from "./utils/debounce";
import { createModal } from "./components/modalInfo";
/** @typedef {Object} Product 
 *  @property {number} id 
 *  @property {string} name 
 *  @property {number} price 
 *  @property {number} stock 
 *  @property {string} description */

const $inventoryList = document.querySelector("#inventory-list");
const $statTotal = document.querySelector("#stat-total");
const $statValue = document.querySelector("#stat-value");
const $statLow = document.querySelector("#stat-low");
const $btnNext = document.querySelector("#btn-next");
const $btnBack = document.querySelector("#btn-back");
const $paginationInfo = document.querySelector("#pagination-info");
const $search = document.querySelector("#search")
const $productForm = document.querySelector("#product-form")
const $btnForm = document.querySelector("#btn-form")
let productId = null
let search = ""
let currentPage = 1;
const limit = 3;
let total = 0;
let maxPage = 1;
let start = 0;
let end = 0;

await init()
async function init() {
    await fetchInfo()
    addEvents();
}
async function fetchInfo() {
    await fetchProductsPerPage();
    await fetchProductsSummaries();
    updatePaginationButtons($btnNext, $btnBack, currentPage, maxPage);
    updateRange();
}
function addEvents() {
    $btnNext.addEventListener("click", nextPage);

    $btnBack.addEventListener("click", backPage);

    $inventoryList.addEventListener("click", handleInventoryActions);

    $search.addEventListener("input", debounce(searchProduct, 500))

    $productForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        await handleCreateUpdateProducts()
    })
}




async function searchProduct() {
    currentPage = 1
    search = $search.value.trim()
    await fetchProductsPerPage()
    updateRange()
    updatePaginationButtons($btnNext, $btnBack, currentPage, maxPage)
}
/**
 * @param {MouseEvent} e
 */
async function handleInventoryActions(e) {
    const button = e.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "delete") {
        const success = await deleteProduct(id);
        if (!success) return;
        await fetchProductsSummaries();
        await fetchProductsPerPage();
        updateRange()
        return;
    }
    if (action === "edit") {
        const product = await getProductById(id)
        if (!product) {
            createModal(false, "Cant get product")
            return
        }
        productId = product.id
        $productForm.elements["name"].value = product.name
        $productForm.elements["description"].value = product.description
        $productForm.elements["price"].value = product.price
        $productForm.elements["stock"].value = product.stock
        $btnForm.textContent = "Update Product"

    }
}

async function handleCreateUpdateProducts() {
    const dataRaw = Object.fromEntries(new FormData($productForm))
    const product = {
        ...dataRaw,
        price: Number(dataRaw.price),
        stock: Number(dataRaw.stock)
    }
    if (!productId) {
        const exists = await productExists(product.name)
        if (exists) {
            createModal(false, "Product exists")
            return
        }
        const response = await createProduct(product)
        if (response) {
            createModal(true, `name: ${response.name}`)
        } else {
            createModal(false, `error creating product`)
        }
    } else {
        const response = await updateProduct(productId, product)
        if (!response) {
            createModal(false, "Cant Update Product")
            return
        }
        createModal(true, "Product Updated")
        $btnForm.textContent = "Create Product"

    }
    $productForm.reset()
    productId = null
    await fetchInfo()
}

async function nextPage() {
    if (currentPage >= maxPage) return;

    currentPage++;

    await fetchProductsPerPage();

    updatePaginationButtons($btnNext, $btnBack, currentPage, maxPage);
    updateRange();
}

async function backPage() {
    if (currentPage <= 1) return;

    currentPage--;

    await fetchProductsPerPage();

    updatePaginationButtons($btnNext, $btnBack, currentPage, maxPage);
    updateRange();
}



function updateRange() {
    ({ start, end } = calculateRange(
        currentPage,
        limit,
        total));

    $paginationInfo.textContent =
        `Mostrando ${start} a ${end} de ${total} productos`;
}

async function fetchProductsPerPage() {
    const data = await getPaginatedProducts(
        currentPage,
        limit,
        search
    );

    if (!data) return;

    total = data.total;
    maxPage = Math.ceil(total / limit) || 1;

    if (currentPage > maxPage) {
        currentPage = maxPage
        return await fetchProductsPerPage()
    }

    createProducts(data.products);
}

async function fetchProductsSummaries() {
    const totalProducts = await getProducts();

    if (!totalProducts) return;

    const stats = calculateSummaries(totalProducts);

    $statTotal.textContent = stats.totalSku;

    $statLow.textContent = stats.totalCritic;

    $statValue.textContent = `$ ${stats.totalValue}`;
}

/**
 * @param {Product[]} products
 */
function createProducts(products) {
    $inventoryList.innerHTML = "";

    products.forEach(product => {
        generateInventoryLine(product, $inventoryList);
    });
}

