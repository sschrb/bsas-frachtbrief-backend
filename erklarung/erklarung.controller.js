const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const erklarungService = require('./erklarung.service');


// routes


router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);








router.delete('/:id', authorize(), _delete);

module.exports = router;



function createSchema(req, res, next) {
    const schema = Joi.object({
        

        code: Joi.string().required(),
        
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    erklarungService.create(req.body)
        .then(() => res.json({ message: 'Erklarung gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    erklarungService.getAll()
        .then(erklarung => res.json(erklarung))
        .catch(next);
}



function getById(req, res, next) {
    erklarungService.getById(req.params.id)
        .then(erklarung => res.json(erklarung))
        .catch(next);
}



function update(req, res, next) {
    erklarungService.update(req.params.id, req.body)
        .then(erklarung => res.json(erklarung))
        .catch(next);
}

function _delete(req, res, next) {
    erklarungService.delete(req.params.id)
        .then(() => res.json({ message: 'Erklarung gelöscht' }))
        .catch(next);
}