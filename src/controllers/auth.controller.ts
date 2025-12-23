import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import Tenant from '../models/Tenant';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyformultitenantsaas';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, tenantName, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        let tenantId = null;
        if (role !== UserRole.SUPER_ADMIN) {
            // Create a default tenant for new creators/users if provided
            const slug = tenantName?.toLowerCase().replace(/\s+/g, '-') || `tenant-${Date.now()}`;
            const tenant = new Tenant({
                name: tenantName || 'Default Workspace',
                slug,
                branding: { primaryColor: '#15B2AE', secondaryColor: '#4f46e5', fontFamily: 'Inter' }
            });
            await tenant.save();
            tenantId = tenant._id;

            // Link owner to tenant
            tenant.owner = undefined as any; // Temporary if we want to link after user creation
        }

        const user = new User({
            email,
            passwordHash,
            firstName,
            lastName,
            role: role || UserRole.USER,
            tenantId
        });

        await user.save();

        if (tenantId) {
            await Tenant.findByIdAndUpdate(tenantId, { owner: user._id });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, tenantId: user.tenantId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, tenantId: user.tenantId }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, tenantId: user.tenantId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, tenantId: user.tenantId }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
