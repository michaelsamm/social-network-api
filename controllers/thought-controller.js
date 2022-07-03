const { Thought, User } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err));
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            // Check if the thought exists -> error if thought does not exist and present data otherwise
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    addThought({ body }, res) {
        Thought.create(body)
            // Take the result id for the thought and find a user matching the username.Then add the new thought id to the thought array on the user
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                // Check if the thought exists -> error if thought does not exist and present data otherwise
                if (!dbUderData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                // Check if the thought exists -> error if thought does not exist and present data otherwise
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                // Check if the thought exists -> error if thought does not exist and present data otherwise
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id' });
                }
                // If thought did exist and was deleted, find the user with the corresponding username and remove the deleted thought from the thoughts array
                return User.findOneAndUpdate(
                    { username: deletedThought.username },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                // Check if the user exists -> error if user does not exist and present data otherwise
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this username' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        // Find a thought based on the id in the url. Then add the new reaction to the reactions array and run validators on the reaction.
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbReactionData => {
                // Check if the thought exists -> error if thought does not exist and present data otherwise
                if (!dbReactionData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbReactionData);
            })
            .catch(err => res.json(err));
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbReactionData => res.json(dbReactionData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;