class Product {
    constructor({ id = null, name = '', unitPrice = 0, quantity = 0, expirationDate = null, category = '', deleted = false } = {}) {
        this.id = id; // ✅ corregido: usar id en vez de idProduct
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.category = category;
        this.deleted = deleted;
        this.totalPrice = this.unitPrice * this.quantity; // ✅ calculado
    }

    static createProduct(data) {
        return new Product(data);
    }

    editProduct(updates) {
        Object.assign(this, updates);
        // recalcular totalPrice si cambian unitPrice o quantity
        if (typeof this.unitPrice === 'number' && typeof this.quantity === 'number') {
            this.totalPrice = this.unitPrice * this.quantity;
        }
    }

    deleteProduct() {
        this.deleted = true;
    }

    consume(amount) {
        const q = Number(amount) || 0;
        if (q <= 0) throw new Error('Consume amount must be > 0');
        if (this.quantity === undefined || this.quantity < q) {
            throw new Error(`Insufficient stock for product ${this.name || this.id}`);
        }
        this.quantity -= q;
        if (typeof this.unitPrice === 'number') {
            this.totalPrice = this.unitPrice * this.quantity;
        }
        return this;
    }
}

export default Product;
