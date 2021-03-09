const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const wagendatenService = require('./wagendaten.service');


// routes


router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);








router.delete('/:id', authorize(), _delete);

module.exports = router;



function createSchema(req, res, next) {
    const schema = Joi.object({
        

      

        wagennummer: Joi.string().required(),
        halter: Joi.string().required().allow(''),
        achsanzahl: Joi.string().required().allow(''),
        eigengewicht: Joi.string().required().allow('')

    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    wagendatenService.create(req.body)
        .then(() => res.json({ message: 'Wagendaten gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    wagendatenService.getAll()
        .then(wagendaten => res.json(wagendaten))
        .catch(next);
}



function getById(req, res, next) {
    wagendatenService.getById(req.params.id)
        .then(wagendaten => res.json(wagendaten))
        .catch(next);
}



function update(req, res, next) {
    wagendatenService.update(req.params.id, req.body)
        .then(wagendaten => res.json(wagendaten))
        .catch(next);
}

function _delete(req, res, next) {
    wagendatenService.delete(req.params.id)
        .then(() => res.json({ message: 'Wagendaten gelöscht' }))
        .catch(next);
}