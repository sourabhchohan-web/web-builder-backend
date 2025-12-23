import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
    name: string;
    slug: string; // Used for subdomains (e.g., slug.platform.com)
    customDomain?: string;
    branding: {
        logo?: string;
        primaryColor: string;
        secondaryColor: string;
        fontFamily: string;
    };
    settings: {
        isWhiteLabeled: boolean;
        allowMarketplace: boolean;
        defaultPlan: string;
    };
    isActive: boolean;
    owner: mongoose.Types.ObjectId;
}

const TenantSchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    customDomain: { type: String, unique: true, sparse: true },
    branding: {
        logo: String,
        primaryColor: { type: String, default: '#3b82f6' },
        secondaryColor: { type: String, default: '#1e293b' },
        fontFamily: { type: String, default: 'Inter' }
    },
    settings: {
        isWhiteLabeled: { type: Boolean, default: false },
        allowMarketplace: { type: Boolean, default: true },
        defaultPlan: { type: String, default: 'free' }
    },
    isActive: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<ITenant>('Tenant', TenantSchema);
