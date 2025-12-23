import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CREATOR = 'creator',
    USER = 'user'
}

export interface IUser extends Document {
    tenantId?: mongoose.Types.ObjectId; // Null for Super Admins
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date
}, { timestamps: true });

// Ensure unique email within a tenant (if applicable) or global for super admins
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema);
