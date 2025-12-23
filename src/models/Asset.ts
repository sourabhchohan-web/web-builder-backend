import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
    name: string;
    url: string;
    type: string;
    size: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true, enum: ['image', 'video', 'file', 'lottie'] },
    size: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
}, { timestamps: true });

export default mongoose.model<IAsset>('Asset', AssetSchema);
