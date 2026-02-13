import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: 'Customer', unique: true },
    items: { type: [cartItemSchema], default: [] }
  },
  {
    timestamps: true
  }
);

cartSchema.index({ customerId: 1 }, { unique: true });

export type CartDocument = InferSchemaType<typeof cartSchema> & { _id: mongoose.Types.ObjectId };

export const CartModel = mongoose.model('Cart', cartSchema);
