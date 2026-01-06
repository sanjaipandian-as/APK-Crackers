import Quotation from '../models/Quotation.js';
import Product from '../models/Product.js';

// @desc    Create a new quotation request
// @route   POST /api/quotations/request
// @access  Private (Customer)
export const createQuotationRequest = async (req, res) => {
    try {
        const { items, customerInfo, estimatedTotal, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items provided for quotation' });
        }

        // Validate all products exist
        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'Some products not found' });
        }

        // Create quotation
        const quotation = new Quotation({
            customerId: req.user.id,
            items,
            customerInfo,
            estimatedTotal,
            customerNotes: notes || '',
            status: 'Pending'
        });

        await quotation.save();

        res.status(201).json({
            message: 'Quotation request submitted successfully',
            quotation
        });
    } catch (error) {
        console.error('Create quotation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get customer's quotations
// @route   GET /api/quotations
// @access  Private (Customer)
export const getCustomerQuotations = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { customerId: req.user.id };
        if (status) {
            query.status = status;
        }

        const quotations = await Quotation.find(query)
            .populate('items.productId', 'name images pricing')
            .populate('sellerId', 'businessName contactInfo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Quotation.countDocuments(query);

        res.json({
            quotations,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get quotations error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single quotation details
// @route   GET /api/quotations/:id
// @access  Private (Customer)
export const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
            .populate('items.productId', 'name images pricing stock_control')
            .populate('sellerId', 'businessName contactInfo email phone');

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        // Check if quotation belongs to the customer
        if (quotation.customerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this quotation' });
        }

        res.json(quotation);
    } catch (error) {
        console.error('Get quotation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Cancel quotation request
// @route   PUT /api/quotations/:id/cancel
// @access  Private (Customer)
export const cancelQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        if (quotation.customerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (quotation.status !== 'Pending') {
            return res.status(400).json({ message: 'Can only cancel pending quotations' });
        }

        quotation.status = 'Cancelled';
        await quotation.save();

        res.json({ message: 'Quotation cancelled successfully', quotation });
    } catch (error) {
        console.error('Cancel quotation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update delivery address for a quotation
// @route   PUT /api/quotations/:id/address
// @access  Private (Customer)
export const updateQuotationAddress = async (req, res) => {
    try {
        const { deliveryAddress } = req.body;
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        if (quotation.customerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (quotation.status !== 'Pending') {
            return res.status(400).json({ message: 'Can only update address for pending quotations' });
        }

        quotation.deliveryAddress = deliveryAddress;
        await quotation.save();

        res.json({ message: 'Delivery address updated successfully', quotation });
    } catch (error) {
        console.error('Update quotation address error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get seller's quotation requests
// @route   GET /api/seller/quotations
// @access  Private (Seller)
export const getSellerQuotations = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { sellerId: req.user.id };
        if (status) {
            query.status = status;
        }

        const quotations = await Quotation.find(query)
            .populate('items.productId', 'name images pricing')
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Quotation.countDocuments(query);

        res.json({
            quotations,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get seller quotations error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Respond to quotation request
// @route   PUT /api/seller/quotations/:id/respond
// @access  Private (Seller)
export const respondToQuotation = async (req, res) => {
    try {
        const { items, quotedTotal, notes, validUntil, contactInfo } = req.body;

        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        if (quotation.status !== 'Pending') {
            return res.status(400).json({ message: 'Quotation already responded or expired' });
        }

        // Update items with quoted prices
        if (items && Array.isArray(items)) {
            quotation.items = quotation.items.map(item => {
                const quotedItem = items.find(i => i.productId === item.productId.toString());
                if (quotedItem) {
                    item.quotedPrice = quotedItem.quotedPrice;
                }
                return item;
            });
        }

        quotation.quotedTotal = quotedTotal;
        quotation.sellerResponse = {
            notes: notes || '',
            validUntil: validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
            contactInfo: contactInfo || '',
            respondedAt: new Date()
        };
        quotation.sellerId = req.user.id;
        quotation.status = 'Responded';

        await quotation.save();

        res.json({ message: 'Quotation response submitted successfully', quotation });
    } catch (error) {
        console.error('Respond to quotation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all pending quotations (for sellers to browse)
// @route   GET /api/seller/quotations/pending
// @access  Private (Seller)
export const getPendingQuotations = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const quotations = await Quotation.find({ status: 'Pending', sellerId: null })
            .populate('items.productId', 'name images pricing')
            .populate('customerId', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Quotation.countDocuments({ status: 'Pending', sellerId: null });

        res.json({
            quotations,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get pending quotations error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
