const fs = require('fs');
const Sauce = require('../models/Sauce');

exports.getSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(err => res.status(400).json({ err }));
};

exports.getSauceById = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json({ err }));
};

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Nouvelle sauce créée" }))
        .catch(err => res.status(400).json({ err }));
};

exports.likeSauce = (req, res) => {
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(201).json({ message: "Like ajouté" }))
            .catch(err => res.status(400).json({ err }));
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(201).json({ message: "Dislike ajouté" }))
            .catch(err => res.status(400).json({ err }));
    } else {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            for (let userId of sauce.usersLiked) {
                if (req.body.userId === userId) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                        .then(() => res.status(200).json({ message: "Like supprimé" }))
                        .catch(err => res.status(400).json({ err }));
                }
            }
            for (let userId of sauce.usersDisliked) {
                if (req.body.userId === userId) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                        .then(() => res.status(200).json({ message: "Dislike supprimé" }))
                        .catch(err => res.status(400).json({ err }));
                }
            }
        })
        .catch(err => res.status(500).json({ err }));
    }
};

exports.modifySauce = (req, res) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, () => {}))
            .catch(err => res.status(500).json({ err }));
    }
    const sauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée" }))
        .catch(err => res.status(400).json({ err }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée" }))
                    .catch(err => res.status(400).json({ err }));
            });
        })
        .catch(err => res.status(500).json({ err }));
};