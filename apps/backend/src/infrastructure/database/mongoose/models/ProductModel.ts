import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & { _id: mongoose.Types.ObjectId };

export const ProductModel = mongoose.model('Product', productSchema);
