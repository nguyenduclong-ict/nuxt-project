//FOR LAPTOP

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductOrderSchema = new Schema(
    {
        warehouse: { type: Schema.Types.ObjectId, ref: 'LaptopWarehouse', required: true },
        warehouseColor: { type: Schema.Types.ObjectId, ref: 'LaptopWarehouseColor', required: true },
        order: { type: Schema.Types.ObjectId, ref: 'LaptopOrder', required: true },
        
        verification: { type: Boolean, default: false, required: true },
        
        whenOrder: {
            amount: { type: Number , required: true },
            price: { type: Number , required: true },
            upprice: { type: Number , required: true },
            discountAmount: { type: Number , required: true },
        }
    }, 
    {
        toJSON: { virtuals: true } 
    }
);

const ProductOrder = mongoose.model('LaptopProductOrder', ProductOrderSchema);

export default ProductOrder;