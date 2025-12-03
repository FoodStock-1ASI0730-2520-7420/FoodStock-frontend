import {SaleItem} from "./saleItem.entity.js";

export class Sale {
    constructor({ id = null, creationDate = new Date().toLocaleDateString(), creationTime = new Date().toLocaleTimeString(), saleType = '', paymentMethod = '', total = 0, waiter = '', saleItems = []}) {
        this.id = id;
        this.creationDate = creationDate;
        this.creationTime = creationTime;
        this.saleType = saleType;
        this.paymentMethod = paymentMethod;
        this.total = total
        this.waiter = waiter;
        this.saleItems = saleItems;
    }

    get totalCount() {
        return this.saleItems.reduce((sum, saleItem) => sum + saleItem.priceUnit * saleItem.quantity,0);
    }
}