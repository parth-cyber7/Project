import { USER_ROLES } from '@ecom/shared';
import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER
    },
    isBlocked: { type: Boolean, default: false },
    refreshTokenHash: { type: String, default: null }
  },
  {
    timestamps: true
  }
);

customerSchema.index({ email: 1 }, { unique: true });

export type CustomerDocument = InferSchemaType<typeof customerSchema> & { _id: mongoose.Types.ObjectId };

export const CustomerModel = mongoose.model('Customer', customerSchema);
