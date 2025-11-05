import Contact from "../models/contact.js";
import catchAsync from "../helpers/catchAsync.js";
import AppError from "../helpers/AppError.js";

// Create a new contact message (POST)
const createContact = catchAsync(async (req, res, next) => {
  const { name, email, subject, message, phoneNumber } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return next(
      new AppError("Name, email, subject, and message are required", 400)
    );
  }

  const newContact = await Contact.create({
    name,
    email,
    subject,
    message,
    phoneNumber,
  });

  res.status(201).json({
    status: "success",
    message: "Contact message sent successfully",
    data: {
      contact: newContact,
    },
  });
});

// Get all contact messages (GET) - Admin only
const getAllContacts = catchAsync(async (req, res, next) => {
  const {
    status,
    isRead,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (isRead !== undefined) filter.isRead = isRead === "true";

  // Calculate pagination
  const skip = (page - 1) * limit;

  const contacts = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select("-__v");

  const totalContacts = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalContacts / limit);

  res.status(200).json({
    status: "success",
    results: contacts.length,
    totalContacts,
    totalPages,
    currentPage: parseInt(page),
    data: {
      contacts,
    },
  });
});

// Get single contact message by ID (GET)
const getContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id).select("-__v");

  if (!contact) {
    return next(new AppError("Contact message not found", 404));
  }

  // Mark as read when viewed
  if (!contact.isRead) {
    contact.isRead = true;
    await contact.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// Update contact status (PUT) - Admin only
const updateContactStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "read", "replied"].includes(status)) {
    return next(
      new AppError("Valid status is required (pending, read, replied)", 400)
    );
  }

  const contact = await Contact.findByIdAndUpdate(
    id,
    {
      status,
      isRead: true,
      ...(status === "replied" && { repliedAt: new Date() }),
    },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return next(new AppError("Contact message not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Contact status updated successfully",
    data: {
      contact,
    },
  });
});

// Delete contact message (DELETE) - Admin only
const deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    return next(new AppError("Contact message not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Contact message deleted successfully",
  });
});

// Get contact statistics (GET) - Admin only
const getContactStats = catchAsync(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalContacts = await Contact.countDocuments();
  const unreadContacts = await Contact.countDocuments({ isRead: false });

  res.status(200).json({
    status: "success",
    data: {
      totalContacts,
      unreadContacts,
      statusBreakdown: stats,
    },
  });
});

export {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
};
