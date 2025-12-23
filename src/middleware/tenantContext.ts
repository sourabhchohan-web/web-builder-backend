import { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant';

export const tenantContext = async (req: Request, res: Response, next: NextFunction) => {
    const host = req.headers.host || '';
    const tenantSlug = host.split('.')[0]; // basic slug detection

    // For development or API testing, allow x-tenant-slug header
    const slug = (req.headers['x-tenant-slug'] as string) || tenantSlug;

    if (!slug || slug === 'www' || slug === 'localhost:5000') {
        // Handle main platform access or global admin
        return next();
    }

    // Mock Auth for testing RBAC
    const mockRole = req.headers['x-user-role'] as string;
    if (mockRole) {
        (req as any).user = {
            id: 'mock-user-id',
            role: mockRole
        };
    }

    try {
        const tenant = await Tenant.findOne({ slug });
        if (tenant) {
            (req as any).tenant = tenant;
        }
        next();
    } catch (error) {
        console.error('Tenant detection error:', error);
        next();
    }
};
