// src/suppliers/application/useSupplierStore.js

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SupplierService } from "./supplier.service.js";
import Supplier from "../domain/model/supplier.entity.js";

const supplierService = new SupplierService();

export const useSupplierStore = defineStore('supplier', () => {
    // --- STATE ---
    const suppliers = ref([]);
    const errors = ref([]);
    const suppliersLoaded = ref(false);

    // --- GETTERS ---
    const suppliersCount = computed(() => suppliers.value.length);

    // --- ACTIONS ---
    async function fetchSuppliers() {
        if (suppliersLoaded.value) return;
        try {
            const fetchedSuppliers = await supplierService.getSuppliers();
            suppliers.value = fetchedSuppliers;
            suppliersLoaded.value = true;
        } catch (error) {
            console.error("Store Error in fetchSuppliers:", error);
            errors.value.push(error);
        }
    }

    async function addSupplier(supplierEntity) {
        try {
            const newEntity = await supplierService.createSupplier(supplierEntity);
            suppliers.value.push(newEntity);
        } catch (error) {
            console.error("Store Error in addSupplier:", error);
            errors.value.push(error);
            throw error;
        }
    }

    async function updateSupplier(supplierEntity) {
        try {
            const updatedEntity = await supplierService.updateSupplier(supplierEntity);
            const index = suppliers.value.findIndex(s => s.idSupplier === updatedEntity.idSupplier);
            if (index !== -1) suppliers.value[index] = updatedEntity;
        } catch (error) {
            console.error("Store Error in updateSupplier:", error);
            errors.value.push(error);
            throw error;
        }
    }

    async function deleteSupplier(id) {
        try {
            await supplierService.deleteSupplier(id);
            const index = suppliers.value.findIndex(s => s.idSupplier === id);
            if (index !== -1) suppliers.value.splice(index, 1);
        } catch (error) {
            console.error("Store Error in deleteSupplier:", error);
            errors.value.push(error);
        }
    }

    // --- RETURN ---
    return {
        suppliers,
        errors,
        suppliersLoaded,
        suppliersCount,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
    }
});
