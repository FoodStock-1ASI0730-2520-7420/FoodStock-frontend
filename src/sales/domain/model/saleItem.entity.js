export class SaleItem {
    constructor({ id = null, dishId = null, name = '', priceUnit = 0, quantity = 0, saleId = null}) {
        this.id = id;
        this.dishId = dishId;
        this.name = name;
        this.priceUnit = priceUnit;
        this.quantity = quantity;
        this.saleId = saleId
    }

    get subtotal(){
        return this.priceUnit * this.quantity;
    }
}