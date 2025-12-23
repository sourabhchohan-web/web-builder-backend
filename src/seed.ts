import mongoose from 'mongoose';
import Tenant from './models/Tenant';
import User, { UserRole } from './models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webbuilder');

        // Clear existing
        await Tenant.deleteMany({});
        await User.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Create Super Admin
        const superAdmin = await User.create({
            email: 'admin@platform.com',
            passwordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: UserRole.SUPER_ADMIN,
        });

        // Create Default Tenant
        const defaultTenant = await Tenant.create({
            name: 'Demo Agency',
            slug: 'demo',
            owner: superAdmin._id,
            branding: {
                primaryColor: '#6366f1',
                secondaryColor: '#4f46e5',
                fontFamily: 'Inter'
            }
        });

        // Link Super Admin to tenant for demo purposes
        superAdmin.tenantId = defaultTenant._id as any;
        await superAdmin.save();

        console.log('Seeding successful');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
