const {Thought, User} = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({_id: -1})
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
            .select('-__v')
            .then((dbThoughtData) => {
                if(!dbThoughtData) {
                    res.status(404).json({message: 'No thought found.'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    addThought({body}, res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: body.userId},
                {$push: {thoughts:_id}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    addReaction({params, body}, res) {
        console.log(body)
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    removeReaction({params},res ) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        )
        .then(dbUserData => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    removeThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id})
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    return res.status(404).json({message:'No thought found.'})
                }
                return User.findOneAndUpdate(
                    {_id: params.username},
                    {$pull: {thoughts: params.thoughtId}},
                    {new: true}
                );
            })
            .then((dbUserData) => {
                if(!dbUserData) {
                    res.status(404).json({message: 'No user found.'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, {
            new: true
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    }
}

module.exports = thoughtController