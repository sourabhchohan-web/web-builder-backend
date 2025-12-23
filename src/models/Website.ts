import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
    tenantId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    subdomain: string;
    customDomain?: string;
    themeId: mongoose.Types.ObjectId;
    favicon?: string;
    status: 'draft' | 'published' | 'archived';
    config: {
        googleAnalyticsId?: string;
        metaPixelId?: string;
    };
}

const WebsiteSchema: Schema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    subdomain: { type: String, required: true, unique: true },
    customDomain: { type: String, unique: true, sparse: true },
    themeId: { type: Schema.Types.ObjectId, ref: 'Theme' },
    favicon: String,
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    config: {
        googleAnalyticsId: String,
        metaPixelId: String
    }
}, { timestamps: true });

export default mongoose.model<IWebsite>('Website', WebsiteSchema);
