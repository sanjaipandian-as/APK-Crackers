import kycRoutes from "./routes/kycRoutes.js";
import adminKycRoutes from "./routes/adminKycRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import customerProductRoutes from "./routes/customerProductRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import sellerOrderRoutes from "./routes/sellerOrderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import sellerAnalyticsRoutes from "./routes/sellerAnalyticsRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";




app.use("/api/admin/products", adminProductRoutes);
app.use("/api/seller/kyc", kycRoutes);
app.use("/api/admin/kyc", adminKycRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/customer", customerProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/seller/orders", sellerOrderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/seller/analytics", sellerAnalyticsRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/notifications", notificationRoutes);
