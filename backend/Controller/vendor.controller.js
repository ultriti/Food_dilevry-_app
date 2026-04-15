const Vendor = require("../Model/vendor.model");
const User = require("../Model/user.model");
const Restaurant = require("../Model/restaurant.model");

// ✅ Create Vendor (from existing Vendor‑role user)
exports.createVendor = async (req, res) => {
  const { businessName, websiteUrl, gstNumber, panNumber, businessAddress, bankDetails } = req.body;
  const userId = req.user?.userId; // from JWT auth middleware

  try {
    // Verify this user exists and has role VENDOR/
    const user = await User.findById(userId);
    if (!user || user.role !== "VENDOR") {
      return res.status(403).json({
        error: [{ message: "Access denied. Vendor registration required." }],
      });
    }

    // Prevent double‑vendor creation
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.status(400).json({
        error: [{ message: "User already registered as a vendor." }],
      });
    }

    const vendor = new Vendor({
      userId,
      businessName,
      websiteUrl,
      gstNumber,
      panNumber,
      businessAddress: {
        street: businessAddress?.street,
        city: businessAddress?.city,
        state: businessAddress?.state,
        pincode: businessAddress?.pincode,
        country: businessAddress?.country,
        coordinates: businessAddress?.coordinates || [],
      },
      bankDetails: {
        accountName: bankDetails?.accountName,
        accountNumber: bankDetails?.accountNumber,
        ifsc: bankDetails?.ifsc,
        upiId: bankDetails?.upiId,
      },
      status: "PENDING", // admin approval flow
    });

    await vendor.save();

    return res.status(201).json({
      message: "Vendor created successfully (pending approval).",
      vendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET All Vendors (admin view)
exports.getAllVendors = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  try {
    const vendors = await Vendor.find(filters)
      .populate("userId", "userName email phoneNumber")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    const total = await Vendor.countDocuments(filters);

    return res.status(200).json({
      vendors,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET Single Vendor (for admin or the vendor itself)
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("userId", "userName email phoneNumber")
      .populate("restaurantIds");

    if (!vendor) {
      return res.status(404).json({
        error: [{ message: "Vendor not found." }],
      });
    }

    return res.status(200).json({ vendor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ GET Vendor by User ID (for vendor dashboard)
exports.getVendorByUserId = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const vendor = await Vendor.findOne({ userId })
      .populate("userId", "userName email phoneNumber")
      .populate("restaurantIds");

    if (!vendor) {
      return res.status(404).json({
        error: [{ message: "Vendor profile not found." }],
      });
    }

    return res.status(200).json({ vendor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ Update Vendor (vendor edits own profile)
exports.updateVendor = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res.status(404).json({
        error: [{ message: "Vendor profile not found." }],
      });
    }

    const updates = req.body;

    if (updates.businessName) vendor.businessName = updates.businessName;
    if (updates.websiteUrl !== undefined) vendor.websiteUrl = updates.websiteUrl;
    if (updates.gstNumber !== undefined) vendor.gstNumber = updates.gstNumber;
    if (updates.panNumber !== undefined) vendor.panNumber = updates.panNumber;

    if (updates.businessAddress?.street) vendor.businessAddress.street = updates.businessAddress.street;
    if (updates.businessAddress?.city) vendor.businessAddress.city = updates.businessAddress.city;
    if (updates.businessAddress?.state) vendor.businessAddress.state = updates.businessAddress.state;
    if (updates.businessAddress?.pincode) vendor.businessAddress.pincode = updates.businessAddress.pincode;
    if (updates.businessAddress?.country) vendor.businessAddress.country = updates.businessAddress.country;
    if (updates.businessAddress?.coordinates) vendor.businessAddress.coordinates = updates.businessAddress.coordinates;

    if (updates.bankDetails?.accountName) vendor.bankDetails.accountName = updates.bankDetails.accountName;
    if (updates.bankDetails?.accountNumber) vendor.bankDetails.accountNumber = updates.bankDetails.accountNumber;
    if (updates.bankDetails?.ifsc) vendor.bankDetails.ifsc = updates.bankDetails.ifsc;
    if (updates.bankDetails?.upiId) vendor.bankDetails.upiId = updates.bankDetails.upiId;

    await vendor.save();

    return res.status(200).json({
      message: "Vendor updated successfully.",
      vendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ Admin: Approve / Reject Vendor
exports.updateVendorStatus = async (req, res) => {
  const { id } = req.params;
  const { status, isVerified, verificationDocumentUrl } = req.body;

  if (!["APPROVED", "SUSPENDED", "DELISTED", "PENDING"].includes(status)) {
    return res.status(400).json({
      error: [{ message: 'Status must be one of "APPROVED", "SUSPENDED", "DELISTED", "PENDING".' }],
    });
  }

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        error: [{ message: "Vendor not found." }],
      });
    }

    vendor.status = status;
    if (isVerified !== undefined) vendor.isVerified = isVerified;
    if (verificationDocumentUrl) vendor.verificationDocumentUrl = verificationDocumentUrl;

    await vendor.save();

    return res.status(200).json({
      message: `Vendor status updated to ${vendor.status}.`,
      vendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};

// ✅ Vendor requests to be converted from user to vendor
exports.requestVendorStatus = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: [{ message: "User not found." }],
      });
    }

    if (user.role !== "VENDOR") {
      return res.status(403).json({
        error: [{ message: "User must be of role VENDOR to request vendor profile." }],
      });
    }

    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.status(400).json({
        error: [{ message: "Vendor profile already exists." }],
      });
    }

    // Create a new Vendor with pending status
    const vendor = new Vendor({
      userId,
      businessName: user.userName,
      status: "PENDING",
    });

    await vendor.save();

    return res.status(201).json({
      message: "Vendor request submitted (pending approval).",
      vendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: [{ message: "Internal server error." }],
    });
  }
};