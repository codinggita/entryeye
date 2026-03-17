const Student = require('../models/Student');

/**
 * @desc    Register a new student
 * @route   POST /api/students
 * @access  Private (Admin, Assistant)
 */
exports.registerStudent = async (req, res, next) => {
  try {
    const { name, rollNo, batchId, faceDescriptor } = req.body;

    // 1. Validate all fields required
    if (!name || !rollNo || !batchId || !faceDescriptor) {
      return res.status(400).json({ message: 'All fields (name, rollNo, batchId, faceDescriptor) are required' });
    }

    // 2. Validate faceDescriptor is an array of length 128
    if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
      return res.status(400).json({ message: 'faceDescriptor must be an array of length 128' });
    }

    // 3. Create student
    const student = new Student({
      name,
      rollNo,
      batchId,
      faceDescriptor,
    });

    // 4. Save student
    await student.save();

    res.status(201).json({
      message: 'Student registered successfully',
      student,
    });
  } catch (error) {
    // 5. Handle duplicate rollNo error (Mongoose error code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Student already exists in this batch' });
    }
    next(error);
  }
};
