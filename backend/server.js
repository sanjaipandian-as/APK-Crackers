import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import cors from 'cors'
import customerAuthRoutes from './src/routes/customerAuthRoutes.js'
import sellerAuthRoutes from './src/routes/sellerAuthRoutes.js'
import sellerAnalyticsRoutes from './src/routes/sellerAnalyticsRoutes.js'
import sellerOrderRoutes from './src/routes/sellerOrderRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import customerProductRoutes from './src/routes/customerProductRoutes.js'
import kycRoutes from './src/routes/kycRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
// Admin routes
import adminAuthRoutes from './src/routes/adminAuthRoutes.js'
import adminProductRoutes from './src/routes/adminProductRoutes.js'
import adminKycRoutes from './src/routes/adminKycRoutes.js'
import adminOrderRoutes from './src/routes/adminOrderRoutes.js'
import adminAnalyticsRoutes from './src/routes/adminAnalyticsRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Customer Routes
app.use('/api/customer/auth', customerAuthRoutes)

// Seller Routes
app.use('/api/seller/auth', sellerAuthRoutes)
app.use('/api/seller/analytics', sellerAnalyticsRoutes)
app.use('/api/seller/orders', sellerOrderRoutes)
app.use('/api/seller/kyc', kycRoutes)

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/kyc', adminKycRoutes)
app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/admin/analytics', adminAnalyticsRoutes)

// Product & Cart Routes
app.use('/api/products', productRoutes)
app.use('/api/products/customer', customerProductRoutes)
app.use('/api/cart', cartRoutes)

// Order & Payment Routes
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

console.log('✅ All routes registered successfully')
console.log('📦 Admin routes available at: /api/admin/*')
console.log('📦 Product routes available at: /api/products')

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== Global Error Handler ===');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message,
      code: err.code
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: err.name,
    details: err.toString()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`)
})
