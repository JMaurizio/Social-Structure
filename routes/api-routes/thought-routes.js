const router = require('express').Router();
const {
    getThoughts,
    getThoughtById,
    addThought,
    addReaction,
    removeReaction,
    removeThought,
    updateThought
} = require('../../controllers/thought-controller');

router.route('/').get(getThoughts).post(addThought);

router.route('/:id').get(getThoughtById).put(updateThought).delete(removeThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;