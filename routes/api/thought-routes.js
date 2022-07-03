const router = require('express').Router();
const {
    getAllThought,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// Set up GET all and x at /api/thoughts
router
    .route('/')
    .get(getAllThought)
    .post(addThought)

// Set up GET single, PUT update thought, and DELETE thought at /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

// Set up POST new reaction at /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction)

// Set up DELETE reaction at /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction)

module.exports = router;