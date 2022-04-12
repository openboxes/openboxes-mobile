import Product from "../product/Product";

export default interface InventoryItem{
    id: string | null,
    product: Product | null,
    lotNumber: string
    expirationDate: Date
}
