const Pet = require('../models/Pet');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
exports.getAllPets = async (req, res) => {
  try {
    const { species, status, city } = req.query;

    // Build filter object
    let filter = {};
    if (species) filter.species = species;
    if (status) filter.status = status;
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const pets = await Pet.find(filter)
      .populate('shelter', 'name shelterName email phone shelterLocation')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('shelter', 'name shelterName email phone shelterLocation');

    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (Shelter only)
exports.createPet = async (req, res) => {
  try {
    // Add shelter ID from authenticated user
    req.body.shelter = req.user.id;

    const pet = await Pet.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: pet,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Shelter only - own pets)
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Make sure user is the shelter owner
    if (pet.shelter.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this pet' 
      });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      data: pet,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Shelter only - own pets)
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Make sure user is the shelter owner
    if (pet.shelter.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this pet' 
      });
    }

    await pet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
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

// @desc    Get pets by shelter
// @route   GET /api/pets/shelter/:shelterId
// @access  Public
exports.getPetsByShelter = async (req, res) => {
  try {
    const pets = await Pet.find({ shelter: req.params.shelterId })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get my pets (for logged in shelter)
// @route   GET /api/pets/my-pets
// @access  Private (Shelter only)
exports.getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ shelter: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};