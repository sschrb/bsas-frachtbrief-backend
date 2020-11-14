const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const bahnhofService = require('./bahnhof.service');


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
        bahnhofscode: Joi.string().required().allow(''),
        land: Joi.string().required().allow(''),
        laendercode: Joi.string().required().allow(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    bahnhofService.create(req.body)
        .then(() => res.json({ message: 'Bahnhof gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    bahnhofService.getAll()
        .then(bahnhof => res.json(bahnhof))
        .catch(next);
}



function getById(req, res, next) {
    bahnhofService.getById(req.params.id)
        .then(bahnhof => res.json(bahnhof))
        .catch(next);
}



function update(req, res, next) {
    bahnhofService.update(req.params.id, req.body)
        .then(bahnhof => res.json(bahnhof))
        .catch(next);
}

function _delete(req, res, next) {
    bahnhofService.delete(req.params.id)
        .then(() => res.json({ message: 'Bahnhof gelöscht' }))
        .catch(next);
}