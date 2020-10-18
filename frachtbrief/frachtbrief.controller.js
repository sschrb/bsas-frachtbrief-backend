const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const frachtbriefService = require('./frachtbrief.service');
const pdfService = require('./pdf.service');
const pdf = require('./pdf');

// routes

router.get('/pdf/:id', authorize(), getPdfById);
router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);

router.post('/pdf', authorize(), createPdf);




router.get('/current', authorize(), getCurrent);

router.delete('/:id', authorize(), _delete);

module.exports = router;



function createSchema(req, res, next) {
    const schema = Joi.object({
        adresse: Joi.string().required(),
        wagenummer: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {

  

    frachtbriefService.create(req.body)
        .then(() => res.json({ message: 'Frachtbrief gespeichert' }))
        .catch(next);
}

function createPdf(req, res, next) {

  

    pdf.createPDF(req.body)
        .then(frachtbrief => res.json(frachtbrief))
        .catch(next);
}



function getAll(req, res, next) {
    frachtbriefService.getAll()
        .then(frachtbrief => res.json(frachtbrief))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getPdfById(req, res, next) {
    console.log(1);
    pdfService.getPdfById(req.params.id)
        .then(pdf => res.json(pdf))
        .catch(next);
}

function getById(req, res, next) {
    frachtbriefService.getById(req.params.id)
        .then(frachtbrief => res.json(frachtbrief))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    frachtbriefService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    frachtbriefService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}