const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const adresseService = require('./adresse.service');


// routes


router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);








router.delete('/:id', authorize(), _delete);

module.exports = router;



function createSchema(req, res, next) {
    const schema = Joi.object({
        

        name: Joi.string().required(),
        strasse: Joi.string().required().allow(''),
        ort: Joi.string().required().allow(''),
        mail: Joi.string().required().allow(''),
        telefon: Joi.string().required().allow(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    adresseService.create(req.body)
        .then(() => res.json({ message: 'Adresse gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    adresseService.getAll()
        .then(adresse => res.json(adresse))
        .catch(next);
}



function getById(req, res, next) {
    adresseService.getById(req.params.id)
        .then(adresse => res.json(adresse))
        .catch(next);
}



function update(req, res, next) {
    adresseService.update(req.params.id, req.body)
        .then(adresse => res.json(adresse))
        .catch(next);
}

function _delete(req, res, next) {
    adresseService.delete(req.params.id)
        .then(() => res.json({ message: 'Adresse gelöscht' }))
        .catch(next);
}