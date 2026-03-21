const express = require('express');
const router = express.Router();
const { createReview, getTourReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/:tourId', getTourReviews);
router.delete('/:id', deleteReview);

module.exports = router;