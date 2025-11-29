const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');

// @desc    Create adoption request
// @route   POST /api/adoptions
// @access  Private (Adopter)
exports.createAdoptionRequest = async (req, res) => {
  try {
    const { petId, adopterInfo } = req.body;

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Check if pet is available
    if (pet.status !== 'available') {
      return res.status(400).json({ 
        success: false,
        message: 'Pet is not available for adoption' 
      });
    }

    // Check if user already has a pending request for this pet
    const existingRequest = await AdoptionRequest.findOne({
      pet: petId,
      adopter: req.user.id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false,
        message: 'You already have a pending request for this pet' 
      });
    }

    // Create adoption request
    const adoptionRequest = await AdoptionRequest.create({
      pet: petId,
      adopter: req.user.id,
      shelter: pet.shelter,
      adopterInfo,
    });

    // Update pet status to pending
    await Pet.findByIdAndUpdate(petId, { status: 'pending' });

    const populatedRequest = await AdoptionRequest.findById(adoptionRequest._id)
      .populate('pet', 'name species breed age images')
      .populate('adopter', 'name email phone')
      .populate('shelter', 'name shelterName email phone');

    res.status(201).json({
      success: true,
      message: 'Adoption request submitted successfully',
      data: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get all adoption requests for shelter
// @route   GET /api/adoptions/shelter
// @access  Private (Shelter)
exports.getShelterRequests = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = { shelter: req.user.id };
    if (status) filter.status = status;

    const requests = await AdoptionRequest.find(filter)
      .populate('pet', 'name species breed age images')
      .populate('adopter', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get all adoption requests for adopter
// @route   GET /api/adoptions/my-requests
// @access  Private (Adopter)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ adopter: req.user.id })
      .populate('pet', 'name species breed age images')
      .populate('shelter', 'name shelterName email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get single adoption request
// @route   GET /api/adoptions/:id
// @access  Private
exports.getAdoptionRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate('pet', 'name species breed age images description')
      .populate('adopter', 'name email phone address')
      .populate('shelter', 'name shelterName email phone shelterLocation');

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Adoption request not found' 
      });
    }

    // Make sure user is either the adopter or the shelter
    if (
      request.adopter._id.toString() !== req.user.id &&
      request.shelter._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this request' 
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Update adoption request status (approve/reject)
// @route   PUT /api/adoptions/:id/status
// @access  Private (Shelter only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be approved or rejected' 
      });
    }

    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Adoption request not found' 
      });
    }

    // Make sure user is the shelter owner
    if (request.shelter.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this request' 
      });
    }

    // Update request status
    request.status = status;
    if (notes) request.notes = notes;
    await request.save();

    // Update pet status
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(request.pet, { status: 'adopted' });
      
      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        { pet: request.pet, status: 'pending', _id: { $ne: request._id } },
        { status: 'rejected', notes: 'Pet has been adopted by another applicant' }
      );
    } else if (status === 'rejected') {
      // Check if there are other pending requests
      const otherPendingRequests = await AdoptionRequest.countDocuments({
        pet: request.pet,
        status: 'pending',
        _id: { $ne: request._id },
      });

      // If no other pending requests, set pet back to available
      if (otherPendingRequests === 0) {
        await Pet.findByIdAndUpdate(request.pet, { status: 'available' });
      }
    }

    const updatedRequest = await AdoptionRequest.findById(request._id)
      .populate('pet', 'name species breed age images')
      .populate('adopter', 'name email phone')
      .populate('shelter', 'name shelterName email phone');

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Delete adoption request (cancel)
// @route   DELETE /api/adoptions/:id
// @access  Private (Adopter only)
exports.deleteAdoptionRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Adoption request not found' 
      });
    }

    // Make sure user is the adopter
    if (request.adopter.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this request' 
      });
    }

    // Can only cancel pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Can only cancel pending requests' 
      });
    }

    await request.deleteOne();

    // Check if there are other pending requests for this pet
    const otherPendingRequests = await AdoptionRequest.countDocuments({
      pet: request.pet,
      status: 'pending',
    });

    // If no other pending requests, set pet back to available
    if (otherPendingRequests === 0) {
      await Pet.findByIdAndUpdate(request.pet, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Adoption request cancelled successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};