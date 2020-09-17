var fs = require('fs');
//var pdflib = require('pdf-lib')
const { degrees, PDFDocument, StandardFonts, rgb } = require('pdf-lib')


const existingPdfBytes = fs.readFileSync('./frachtbrief/bsas_test.pdf')


module.exports = {
    createPDF

}

async function createPDF(json) {


    

 
  


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
firstPage.drawText(json.adresse, {
  x: 5,
  y: height / 2 + 300,
  size: 12,
  font: helveticaFont
  
})
 
 
// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()
 

fs.writeFile('test.pdf', pdfBytes, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });

}
