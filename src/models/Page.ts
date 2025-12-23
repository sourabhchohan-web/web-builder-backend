import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
    websiteId: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    description?: string;
    layout: any; // Hierarchical JSON structure of components
    seo: {
        title?: string;
        description?: string;
        ogImage?: string;
    };
    isHomePage: boolean;
    status: 'draft' | 'published';
}

const PageSchema: Schema = new Schema({
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    layout: { type: Schema.Types.Mixed, default: [] },
    seo: {
        title: String,
        description: String,
        ogImage: String
    },
    isHomePage: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

// Ensure unique slug per website
PageSchema.index({ websiteId: 1, slug: 1 }, { unique: true });

export default mongoose.model<IPage>('Page', PageSchema);
