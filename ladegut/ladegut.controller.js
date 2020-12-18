const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const ladegutService = require('./ladegut.service');


// routes


router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);








router.delete('/:id', authorize(), _delete);

module.exports = router;



function createSchema(req, res, next) {
    const schema = Joi.object({
        

      

        

        bezeichnung: Joi.string().required(),
        bemerkung: Joi.string().required().allow(''),
        dichte: Joi.string().required().allow(''),
        rid: Joi.string().required().allow(''),
        nhm: Joi.string().required().allow(''),
        wagentyp: Joi.string().required().allow(''),

        

    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    ladegutService.create(req.body)
        .then(() => res.json({ message: 'ladegut gespeichert' }))
        .catch(next);
}





function getAll(req, res, next) {
    ladegutService.getAll()
        .then(ladegut => res.json(ladegut))
        .catch(next);
}



function getById(req, res, next) {
    ladegutService.getById(req.params.id)
        .then(ladegut => res.json(ladegut))
        .catch(next);
}



function update(req, res, next) {
    ladegutService.update(req.params.id, req.body)
        .then(ladegut => res.json(ladegut))
        .catch(next);
}

function _delete(req, res, next) {
    ladegutService.delete(req.params.id)
        .then(() => res.json({ message: 'Ladegut gelöscht' }))
        .catch(next);
}