import { Request, Response } from 'express';
import Asset from '../models/Asset';

export const getAssets = async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).tenant?._id;
        if (!tenantId) {
            return res.status(400).json({ message: 'Tenant context missing' });
        }

        const assets = await Asset.find({ tenantId });
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error });
    }
};

export const uploadAsset = async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).tenant?._id;
        if (!tenantId) {
            return res.status(400).json({ message: 'Tenant context missing' });
        }

        const { name, url, type, size } = req.body;
        const newAsset = new Asset({
            name,
            url,
            type,
            size,
            tenantId
        });

        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading asset', error });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tenantId = (req as any).tenant?._id;

        const asset = await Asset.findOne({ _id: id, tenantId });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found or unauthorized' });
        }

        await Asset.findByIdAndDelete(id);
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting asset', error });
    }
};
