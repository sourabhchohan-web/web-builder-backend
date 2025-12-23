import mongoose, { Schema, Document } from 'mongoose';

export interface ITheme extends Document {
    name: string;
    description: string;
    previewImage: string;
    creatorId: mongoose.Types.ObjectId; // User who created it
    price: number;
    category: string;
    config: {
        styles: any;
        defaultLayouts: any;
    };
    stats: {
        downloads: number;
        rating: number;
    };
    isApproved: boolean;
}

const ThemeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: String,
    previewImage: String,
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, default: 0 },
    category: { type: String, required: true },
    config: {
        styles: { type: Schema.Types.Mixed },
        defaultLayouts: { type: Schema.Types.Mixed }
    },
    stats: {
        downloads: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ITheme>('Theme', ThemeSchema);
