const express = require('express');
const router = express.Router();
const {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetsByShelter,
  getMyPets,
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);
router.get('/shelter/:shelterId', getPetsByShelter);

// Protected routes - Shelter only
router.get('/my-pets/list', protect, authorize('shelter'), getMyPets);
router.post('/', protect, authorize('shelter'), createPet);
router.put('/:id', protect, authorize('shelter'), updatePet);
router.delete('/:id', protect, authorize('shelter'), deletePet);

module.exports = router;