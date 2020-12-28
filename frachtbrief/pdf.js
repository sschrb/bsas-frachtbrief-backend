var fs = require('fs');
const pdfService = require('./pdf.service');
const frachtbriefService = require('./frachtbrief.service');

//var pdflib = require('pdf-lib')
const { degrees, PDFDocument, StandardFonts, rgb } = require('pdf-lib')


const existingPdfBytes = fs.readFileSync('./frachtbrief/cim.pdf')


module.exports = {
    createPDF,
    getPDF

}

async function createPDF(json) {


//const frachtid = req.params.id;
    

 
  


// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)


const form = pdfDoc.getForm()
const absender = form.getTextField('Expéditeur1')
absender.setText([json.frachtbriefdata.adresse1.name, json.frachtbriefdata.adresse1.strasse, json.frachtbriefdata.adresse1.ort].join('\n'))


const absenderMail = form.getTextField('E-Mail0')
absenderMail.setText(json.frachtbriefdata.adresse1.mail)


const absenderTel = form.getTextField('Tel0')
absenderTel.setText(json.frachtbriefdata.adresse1.telefon)







const ablieferungsOrtCode = form.getTextField('DIUM12')
ablieferungsOrtCode.setText(json.frachtbriefdata.bahnhof7.bahnhofscode)

const ablieferungsOrtBahnhof = form.getTextField('Gare')
ablieferungsOrtBahnhof.setText(json.frachtbriefdata.bahnhof7.name)

const ablieferungsOrtLand = form.getTextField('Pays')
ablieferungsOrtLand.setText(json.frachtbriefdata.bahnhof7.land)


const empfanger = form.getTextField('Destinataire4')
empfanger.setText([json.frachtbriefdata.adresse2.name, json.frachtbriefdata.adresse2.strasse, json.frachtbriefdata.adresse2.ort].join('\n'))

const empfangerMail = form.getTextField('E-Mail')
empfangerMail.setText(json.frachtbriefdata.adresse2.mail)

const empfangerTel = form.getTextField('Tel')
empfangerTel.setText(json.frachtbriefdata.adresse2.telefon)


const erklarungAbsender = form.getTextField('Déclaration expéditeur7')
erklarungAbsender.setText(json.frachtbriefdata.erklarung.code)

const absenderRef = form.getTextField('Info destinataire15')
absenderRef.setText(json.frachtbriefdata.refnr)

const absenderRef2 = form.getTextField('Référence Expéditeur8')
absenderRef2.setText(json.frachtbriefdata.refnr)


const ortDatumAusstellung = form.getTextField('Lieu et date d\'établissement29')
ortDatumAusstellung.setText(json.frachtbriefdata.ausstellung.ort+' '+json.frachtbriefdata.ausstellung.datum.substring(0,10))




const ubernahmeOrt = form.getTextField('Lieu2-16')
ubernahmeOrt.setText(json.frachtbriefdata.ubernahmeort.name)


const ubernahmeOrtDate = form.getTextField('Mois/jour/heure')
let monat = json.frachtbriefdata.ubernahmeort.datum.substring(5,7)
let tag = json.frachtbriefdata.ubernahmeort.datum.substring(8,10)
let stunde = json.frachtbriefdata.ubernahmeort.datum.substring(11,13)
ubernahmeOrtDate.setText(monat + tag + stunde)






const wagennummer = form.getTextField('Wagon n°0-18')
wagennummer.setText('gem. Ladeliste')


const radioGroupCIMCUV = form.getRadioGroup('Gruppieren1')
if(json.frachtbriefdata.type == 'CUV'){
  radioGroupCIMCUV.select('Auswahl2')
} else {
  radioGroupCIMCUV.select('Auswahl1')
}


//Frank fracht ankreuzen
const radioGroupFracht = form.getRadioGroup('Gruppieren2')
radioGroupFracht.select('Auswahl1')

// Embed the Helvetica font
const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
 
// Get the first page of the document
const pages = pdfDoc.getPages()
//const firstPage = pages[0]
 
// Get the width and height of the first page
//const { width, height } = firstPage.getSize()

// Draw a string of text diagonally across the first page
console.log(json)


for (i = 0; i < pages.length; i++){
  const firstPage = pages[i]
console.log(i)
console.log(i%2)
console.log((i%2)==0)
if((i%2)==0){

  
//andere beförderer name
firstPage.drawText(json.frachtbriefdata.aBeforderer1.name, {
  x: 174,
  y: 145,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer2.name, {
  x: 174,
  y: 138,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer3.name, {
  x: 174,
  y: 131,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer4.name, {
  x: 174,
  y: 124,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer5.name, {
  x: 174,
  y: 117,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer6.name, {
  x: 174,
  y: 110,
  size: 8,
  font: helveticaFont,
  
  
  
})

//andere beförderer strecke
firstPage.drawText(json.frachtbriefdata.aBeforderer1.strecke, {
  x: 360,
  y: 145,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer2.strecke, {
  x: 360,
  y: 138,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer3.strecke, {
  x: 360,
  y: 131,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer4.strecke, {
  x: 360,
  y: 124,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer5.strecke, {
  x: 360,
  y: 117,
  size: 8,
  font: helveticaFont,
  
  
  
})
firstPage.drawText(json.frachtbriefdata.aBeforderer6.strecke, {
  x: 360,
  y: 110,
  size: 8,
  font: helveticaFont,
  
  
  
})
 
}


}
 
// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()
const blob = Buffer.from(pdfBytes);
await pdfService.create({pdf: blob})
  .then( async (item) => {
    
    await frachtbriefService.update(json.id, {pdf_id: item.id})})

console.log('pdf durch')

return await frachtbriefService.getById(json.id);
}

async function getPDF(id) {

const obj = await pdfService.getById(id)

const ausdb = Uint8Array.from(obj.pdf);


 

fs.writeFile('test2.pdf', ausdb, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });
}
