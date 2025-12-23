import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal',
    PURCHASE = 'purchase',
    EARNING = 'earning',
    REFUND = 'refund'
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface IWalletTransaction extends Document {
    walletId: mongoose.Types.ObjectId;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    metadata: any;
}

const WalletTransactionSchema: Schema = new Schema({
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING },
    description: String,
    metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
