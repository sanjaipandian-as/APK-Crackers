export const sellerApproved = (req, res, next) => {
  if (req.userRole !== "seller") {
    return res.status(403).json({ message: "Only sellers can access this route" });
  }

  // TODO: Re-enable this when KYC verification system is fully implemented
  // For now, allowing sellers to add products without KYC approval for testing
  if (req.user.kycStatus !== "approved") {
    return res.status(403).json({ message: "Your KYC is not approved yet. Cannot add products." });
  }

  next();
};
