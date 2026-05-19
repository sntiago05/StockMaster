/**
 * @param {Product[]} products
 * @returns {{
 *   totalSku: number,
 *   totalCritic: number,
 *   totalValue: number
 * }}
 */
export function calculateSummaries(products) {
    return {
        totalSku: products.length,

        totalCritic: products.filter(
            product => product.stock < 5
        ).length,

        totalValue: products.reduce(
            (acc, product) =>
                acc + (product.price * product.stock),
            0
        )
    };
}