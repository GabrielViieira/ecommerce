
export type PayQuery = {
    items:[
    name: string,
    value: number,
    quantity: number,
    price: number
]}
export type CartItem = {
    productId: string;
    name: string;
    priceAtPurchase: number;
    quantity: number;
}