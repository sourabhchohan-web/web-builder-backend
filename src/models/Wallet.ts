import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    balance: number;
    currency: string;
    isActive: boolean;
}

const WalletSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

WalletSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export default mongoose.model<IWallet>('Wallet', WalletSchema);
