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