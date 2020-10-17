var fs = require('fs');
const pdfService = require('./pdf.service');
const frachtbriefService = require('./frachtbrief.service');

//var pdflib = require('pdf-lib')
const { degrees, PDFDocument, StandardFonts, rgb } = require('pdf-lib')


const existingPdfBytes = fs.readFileSync('./frachtbrief/bsas_test.pdf')


module.exports = {
    createPDF,
    getPDF

}

async function createPDF(json) {


//const frachtid = req.params.id;
    

 
  


// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)
 
// Embed the Helvetica font
const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
 
// Get the first page of the document
const pages = pdfDoc.getPages()
const firstPage = pages[0]
 
// Get the width and height of the first page
const { width, height } = firstPage.getSize()
 
// Draw a string of text diagonally across the first page
console.log(json)
firstPage.drawText(json.adresse, {
  x: 5,
  y: height / 2 + 300,
  size: 30,
  font: helveticaFont
  
})
 
 
// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()
const blob = Buffer.from(pdfBytes);
pdfService.create({pdf: blob})
  .then(item => {
    console.log(item)
    frachtbriefService.update(json.id, {pdf_id: item.id})})



}

async function getPDF(id) {

const obj = await pdfService.getById(id)

const ausdb = Uint8Array.from(obj.pdf);


 

fs.writeFile('test2.pdf', ausdb, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });
}
