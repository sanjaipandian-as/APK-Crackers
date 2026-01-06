import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        default: null
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        indicativePrice: {
            type: Number,
            required: true,
            min: 0
        },
        quotedPrice: {
            type: Number,
            default: null,
            min: 0
        }
    }],
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    deliveryAddress: {
        type: Object,
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Responded', 'Expired', 'Cancelled'],
        default: 'Pending'
    },
    estimatedTotal: {
        type: Number,
        required: true,
        min: 0
    },
    quotedTotal: {
        type: Number,
        default: null,
        min: 0
    },
    customerNotes: {
        type: String,
        default: ''
    },
    sellerResponse: {
        notes: {
            type: String,
            default: ''
        },
        validUntil: {
            type: Date,
            default: null
        },
        contactInfo: {
            type: String,
            default: ''
        },
        respondedAt: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
quotationSchema.index({ customerId: 1, createdAt: -1 });
quotationSchema.index({ sellerId: 1, status: 1 });
quotationSchema.index({ status: 1, createdAt: -1 });

// Auto-expire quotations after 30 days if not responded
quotationSchema.pre('save', async function () {
    if (this.status === 'Pending' && this.createdAt) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (this.createdAt < thirtyDaysAgo) {
            this.status = 'Expired';
        }
    }
});

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;
