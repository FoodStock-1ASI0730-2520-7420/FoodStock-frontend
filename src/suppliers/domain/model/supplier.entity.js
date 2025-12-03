// src/suppliers/domain/model/supplier.entity.js

class Supplier {
    constructor({ idSupplier, name, contact, type, email }) {
        this.idSupplier = idSupplier;
        this.name = name;
        this.contact = contact;
        this.type = type;
        this.email = email;
    }

    createSupplier() {
        throw new Error('No implementado');
    }

    editSupplier() {
        throw new Error('No implementado');
    }

    deleteSupplier() {
        throw new Error('No implementado');
    }
}

export default Supplier;
