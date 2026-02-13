import { ORDER_STATUSES } from '@ecom/shared';
import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: 'Customer' },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.PENDING
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export type OrderDocument = InferSchemaType<typeof orderSchema> & { _id: mongoose.Types.ObjectId };

export const OrderModel = mongoose.model('Order', orderSchema);
