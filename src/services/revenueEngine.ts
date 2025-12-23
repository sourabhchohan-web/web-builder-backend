import Wallet from '../models/Wallet';
import WalletTransaction, { TransactionType, TransactionStatus } from '../models/WalletTransaction';
import mongoose from 'mongoose';

const PLATFORM_FEE_PERCENT = 30; // Platform takes 30%, Creator takes 70%

export class RevenueEngine {
    /**
     * Handles a theme purchase and splits revenue between creator and platform.
     */
    static async processThemePurchase(
        purchaseAmount: number,
        creatorUserId: string,
        buyerUserId: string,
        tenantId: string,
        themeId: string
    ) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Calculate split
            const creatorShare = purchaseAmount * (1 - PLATFORM_FEE_PERCENT / 100);
            const platformShare = purchaseAmount - creatorShare;

            // 2. Debit Buyer Wallet
            const buyerWallet = await Wallet.findOne({ userId: buyerUserId, tenantId }).session(session);
            if (!buyerWallet || buyerWallet.balance < purchaseAmount) {
                throw new Error('Insufficient funds in wallet');
            }
            buyerWallet.balance -= purchaseAmount;
            await buyerWallet.save();

            // 3. Record Buyer Transaction
            await WalletTransaction.create([{
                walletId: buyerWallet._id,
                amount: -purchaseAmount,
                type: TransactionType.PURCHASE,
                status: TransactionStatus.COMPLETED,
                description: `Purchase of theme ${themeId}`,
                metadata: { themeId }
            }], { session });

            // 4. Credit Creator Wallet (assuming creator is on a specific tenant or global)
            const creatorWallet = await Wallet.findOne({ userId: creatorUserId }).session(session);
            if (creatorWallet) {
                creatorWallet.balance += creatorShare;
                await creatorWallet.save();

                await WalletTransaction.create([{
                    walletId: creatorWallet._id,
                    amount: creatorShare,
                    type: TransactionType.EARNING,
                    status: TransactionStatus.COMPLETED,
                    description: `Earnings from theme sale ${themeId}`,
                    metadata: { themeId, buyerId: buyerUserId }
                }], { session });
            }

            // 5. Platform Revenue (Log only for now, would typically go to a system wallet)
            console.log(`Platform Fee Collected: $${platformShare}`);

            await session.commitTransaction();
            return { success: true, creatorShare, platformShare };
        } catch (error) {
            await session.abortTransaction();
            console.error('Revenue split failed:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
