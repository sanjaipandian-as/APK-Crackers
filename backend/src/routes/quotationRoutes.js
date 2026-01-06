import express from 'express';
import {
    createQuotationRequest,
    getCustomerQuotations,
    getQuotationById,
    cancelQuotation,
    updateQuotationAddress,
    getSellerQuotations,
    respondToQuotation,
    getPendingQuotations
} from '../controllers/quotationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/request', authenticate, createQuotationRequest);
router.get('/', authenticate, getCustomerQuotations);
router.get('/:id', authenticate, getQuotationById);
router.put('/:id/cancel', authenticate, cancelQuotation);
router.put('/:id/address', authenticate, updateQuotationAddress);

// Seller routes
router.get('/seller/all', authenticate, getSellerQuotations);
router.get('/seller/pending', authenticate, getPendingQuotations);
router.put('/seller/:id/respond', authenticate, respondToQuotation);

export default router;
