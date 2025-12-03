import {SaleItem} from "../domain/model/saleItem.entity.js";

export class SaleItemAssembler {
    static toEntityFromResource(resource) {
        return new SaleItem({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['saleItems'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}