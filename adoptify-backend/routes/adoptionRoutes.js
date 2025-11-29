const express = require('express');
const router = express.Router();
const {
  createAdoptionRequest,
  getShelterRequests,
  getMyRequests,
  getAdoptionRequest,
  updateRequestStatus,
  deleteAdoptionRequest,
} = require('../controllers/adoptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Adopter routes
router.post('/', createAdoptionRequest);
router.get('/my-requests', getMyRequests);
router.delete('/:id', deleteAdoptionRequest);

// Shelter routes
router.get('/shelter', authorize('shelter'), getShelterRequests);
router.put('/:id/status', authorize('shelter'), updateRequestStatus);

// Both can access
router.get('/:id', getAdoptionRequest);

module.exports = router;