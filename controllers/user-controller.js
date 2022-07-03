const { User, Thought } = require('../models');

const userController = {
    getAllUser(req, res) {
        User.find({})
            // Include the data for any thoughts and friends on the user excluding the versions
            .populate([
                {
                    path: 'thoughts',
                    select: '-__v'
                },
                {
                    path: 'friends',
                    select: '-__v'
                }
            ])
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(400).json(err));
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            // Include the data for any thoughts and friends on the user excluding the versions    
            .populate([
                {
                    path: 'thoughts',
                    select: '-__v'
                },
                {
                    path: 'friends',
                    select: '-__v'
                }
            ])
            .select('-__v')
            // Check if the user exists -> error if user does not exist and present data otherwise
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        // Find the user per the id in the URL and run validation checks on the updates
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            // Include the data for any thoughts and friends on the user excluding the versions 
            .populate([
                {
                    path: 'thoughts',
                    select: '-__v'
                },
                {
                    path: 'friends',
                    select: '-__v'
                }
            ])
            // Check if the user exists -> error if user does not exist and present data otherwise
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(deletedUser => {
                // Check if the user exists -> error if user does not exist and present data otherwise
                if (!deletedUser) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                // If user was deleted then find all thoughts matching the deleted username (which must be unique)
                return Thought.deleteMany({ username: deletedUser.username }
                );
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)});
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: { _id: params.friendId } } },
            { new: true }
        )
            .then(dbUserData => {
                // Check if the user exists -> error if user does not exist and present data otherwise
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = userController;