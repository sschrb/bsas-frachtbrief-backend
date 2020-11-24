const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const evuService = require('./evu.service');


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
        short: Joi.string().required().allow(''),
        code: Joi.string().required().allow(''),

    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    evuService.create(req.body)
        .then(() => res.json({ message: 'EVU gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    evuService.getAll()
        .then(evu => res.json(evu))
        .catch(next);
}



function getById(req, res, next) {
    evuService.getById(req.params.id)
        .then(evu => res.json(evu))
        .catch(next);
}



function update(req, res, next) {
    evuService.update(req.params.id, req.body)
        .then(evu => res.json(evu))
        .catch(next);
}

function _delete(req, res, next) {
    evuService.delete(req.params.id)
        .then(() => res.json({ message: 'EVU gelöscht' }))
        .catch(next);
}