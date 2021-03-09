var fs = require('fs');
const pdfService = require('./pdf.service');
const frachtbriefService = require('./frachtbrief.service');
var fonts = {
	Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
	};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);

//var pdflib = require('pdf-lib')
const { degrees, PDFDocument, StandardFonts, rgb } = require('pdf-lib')


const existingPdfBytes = fs.readFileSync('./frachtbrief/cim.pdf')
const dateinameLadeliste = Math.random().toString(36).substring(7);


module.exports = {
    createPDF,
    getPDF,
    createFinalPDF

}

async function createFinalPDF(data) {


  var nhmdata =  []
 

var nhmgesamtgewicht


  var ridcheck = false;
console.log(data)
  var json = data.frachtbriefdata.ladeliste
var i = 1;


var docDefinition1 = {
  content: []
}
docDefinition1.content.push({text:'Ladeliste', fontSize: 14}, ' ')
docDefinition1.content.push({
style: 'tableExample',
table: {
  widths: ['*', '*', '*'],
  body: [
    ['Absender\n'+ data.frachtbriefdata.adresse1.name +'\n'+ data.frachtbriefdata.adresse1.ort, 'Empfänger\n' + data.frachtbriefdata.adresse2.name +'\n'+ data.frachtbriefdata.adresse2.ort , 'Datum\n' + (json.ladelistedata.datum).slice(0, 10).split('-').reverse().join('/')],
    ['Abgangsbahnhof\n' + data.frachtbriefdata.bahnhof1.name +'\n'+ data.frachtbriefdata.bahnhof1.land, 'Zielbahnhof\n'+ data.frachtbriefdata.bahnhof7.name +'\n'+ data.frachtbriefdata.bahnhof7.land, 'Referenz\n'+data.frachtbriefdata.refnr]
  ]
}
}, ' ', ' ')

var gesamtsumme = {
liter: 0,
masse: 0,
tara: 0,
bruttogew: 0,
}

for(ladegut in json.ladelistedata){
//console.log(json.ladelistedata[ladegut].ladegut)






if(json.ladelistedata[ladegut].ladegut && json.ladelistedata[ladegut].ladegut.nhm){


  if(json.ladelistedata[ladegut].ladegut.rid == 'Ja'){
    ridcheck = true;
  }


var zwischensumme = {
liter: 0,
masse: 0,
tara: 0,
bruttogew: 0,
}
  var basetable = {
    style: 'tableExample',
    table: {
      headerRows: 1,
      // dontBreakRows: true,
      keepWithHeaderRows: 1,
      widths: ['auto', 65, 'auto', 145,'auto', 'auto', 'auto','auto', 'auto', 'auto'],
      body: [
        [{text: 'Nr.', fontSize: 8}, {text: 'Wagennummer', fontSize: 8}, {text: 'Achs-\n anzahl', fontSize: 8}, {text: 'Bezeichnung des Gutes', fontSize: 8, alignment: 'center'}, {text: 'Liter', fontSize: 8}, {text: 'Dichte', fontSize: 8}, {text: 'RID', fontSize: 8}, {text: 'Masse\nLadung (kg)', fontSize: 8}, {text: 'Tara Wagen\n(kg)', fontSize: 8}, {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
        
                ]
    }
  }
  for(wagen in json.ladelistedata[ladegut].wagen){
    console.log(json.ladelistedata[ladegut].wagen[wagen])

    zwischensumme.masse= ((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000) + zwischensumme.masse;
    zwischensumme.liter= Number(json.ladelistedata[ladegut].wagen[wagen].liter) + zwischensumme.liter
    zwischensumme.tara=json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht + zwischensumme.tara
    zwischensumme.bruttogew=((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000) + json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht + zwischensumme.bruttogew

    basetable.table.body.push( [{text: i, fontSize: 8}, {text: formatWagennummer(json.ladelistedata[ladegut].wagen[wagen].wagendaten.wagennummer), fontSize: 8},
       {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.achsanzahl, fontSize: 8}, 
       {text: json.ladelistedata[ladegut].ladegut.bezeichnung, fontSize: 8, alignment: 'center'}, 
       {text: numberWithCommas((json.ladelistedata[ladegut].ladegut.dichte==1000 ? '': json.ladelistedata[ladegut].wagen[wagen].liter)), fontSize: 8}, 
         {text: numberWithCommas((json.ladelistedata[ladegut].ladegut.dichte==1000 ? '': json.ladelistedata[ladegut].ladegut.dichte)), fontSize: 8}, 
       {text: json.ladelistedata[ladegut].ladegut.rid, fontSize: 8}, 
       {text: numberWithCommas(((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000).toFixed(3)), fontSize: 8}, 
       {text: numberWithCommas(json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht), fontSize: 8}, 
       {text: numberWithCommas((((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000) + json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht).toFixed(3)), fontSize: 8}],
)
    i++;
  }


nhmdata.push({nhm: json.ladelistedata[ladegut].ladegut.nhm, summe: numberWithCommas(zwischensumme.masse.toFixed(3))})

  

  basetable.table.body.push([{text: 'Zwischensumme:', colSpan: 4, fontSize: 8, alignment: 'right' },{},{},{}, {text: numberWithCommas(zwischensumme.liter.toFixed(3)), fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: numberWithCommas(zwischensumme.masse.toFixed(3)), fontSize: 8}, {text: numberWithCommas(zwischensumme.tara.toFixed(3)), fontSize: 8}, {text: numberWithCommas(zwischensumme.bruttogew.toFixed(3)), fontSize: 8}],
  )
  gesamtsumme.masse = zwischensumme.masse + gesamtsumme.masse
  gesamtsumme.liter = zwischensumme.liter + gesamtsumme.liter
  gesamtsumme.tara = zwischensumme.tara + gesamtsumme.tara
  gesamtsumme.bruttogew = zwischensumme.bruttogew + gesamtsumme.bruttogew



  docDefinition1.content.push(basetable)
docDefinition1.content.push(

  
  ' ',
  
  {text:'Bemerkung:\n' +json.ladelistedata[ladegut].ladegut.bemerkung, fontSize: 8},
  ' ',
  {text:'NHM-Code: ' +json.ladelistedata[ladegut].ladegut.nhm, fontSize: 8},
  
  ' ',
  ' ',



)

}





}
nhmdata.push({nhm: 'gesamtsumme', summe: numberWithCommas(gesamtsumme.masse.toFixed(3))})
docDefinition1.content.push(
' ',
    ' ',
    
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        // dontBreakRows: true,
        keepWithHeaderRows: 1,
        widths: [259, 'auto', 'auto', 'auto','auto', 42, 'auto'],
        body: [
            [{text: 'Gesamtsumme:', fontSize: 8, alignment: 'right' }, {text: numberWithCommas(gesamtsumme.liter.toFixed(3))+'\n(I Ladung)', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: numberWithCommas(gesamtsumme.masse.toFixed(3))+'\n(kg Ladung)', fontSize: 8}, {text: numberWithCommas(gesamtsumme.tara.toFixed(3))+'\n(kg Tara)', fontSize: 8}, {text:numberWithCommas(gesamtsumme.bruttogew.toFixed(3))+'\n(kg Brutto)', fontSize: 8}],

                  ]
      }
    },

)



var pdfLadeliste = printer.createPdfKitDocument(docDefinition1)
pdfLadeliste.pipe(fs.createWriteStream(dateinameLadeliste));
pdfLadeliste.end();





console.log("2. PDF beginnt")





//################################################################################################################################



//const frachtid = req.params.id;
    

 
  json = data


// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)


const form = pdfDoc.getForm()
const absender = form.getTextField('Expéditeur1')
absender.setText([json.frachtbriefdata.adresse1.name, json.frachtbriefdata.adresse1.strasse, json.frachtbriefdata.adresse1.ort].join('\n'))


const absenderMail = form.getTextField('E-Mail0')
absenderMail.setText("\n" + formatMail(json.frachtbriefdata.adresse1.mail))


const absenderTel = form.getTextField('Tel0')
absenderTel.setText(json.frachtbriefdata.adresse1.telefon)







const ablieferungsOrtCode = form.getTextField('DIUM12')
ablieferungsOrtCode.setText(json.frachtbriefdata.bahnhof7.laendercode + json.frachtbriefdata.bahnhof7.bahnhofscode)


const ablieferungsOrtBahnhof = form.getTextField('Gare')
ablieferungsOrtBahnhof.setText(json.frachtbriefdata.bahnhof7.name)

const ablieferungsOrtLand = form.getTextField('Pays')
ablieferungsOrtLand.setText(json.frachtbriefdata.bahnhof7.land)


const empfanger = form.getTextField('Destinataire4')
empfanger.setText([" ", json.frachtbriefdata.adresse2.name, json.frachtbriefdata.adresse2.strasse, json.frachtbriefdata.adresse2.ort].join('\n'))

const empfangerMail = form.getTextField('E-Mail')
empfangerMail.setText("\n" + formatMail(json.frachtbriefdata.adresse2.mail))

const empfangerTel = form.getTextField('Tel')
empfangerTel.setText(json.frachtbriefdata.adresse2.telefon)


const erklarungAbsender = form.getTextField('Déclaration expéditeur7')
erklarungAbsender.setText(json.frachtbriefdata.erklarung.code)

const absenderRef = form.getTextField('Info destinataire15')
absenderRef.setText(json.frachtbriefdata.refnr)

const absenderRef2 = form.getTextField('Référence Expéditeur8')
absenderRef2.setText(json.frachtbriefdata.refnr)


const ortDatumAusstellung = form.getTextField('Lieu et date d\'établissement29')
ortDatumAusstellung.setText(json.frachtbriefdata.ausstellung.ort+' '+(json.frachtbriefdata.ausstellung.datum).slice(0, 10).split('-').reverse().join('/'))


const bezeichnungGut = form.getTextField('Description21')
bezeichnungGut.setText(json.frachtbriefdata.bezeichnungGut)


const kommerzBed = form.getTextField('Conditions commerciales13')
kommerzBed.setText(json.frachtbriefdata.kommerziellebedingungen)

const ubernahmeOrt = form.getTextField('Lieu2-16')
ubernahmeOrt.setText(json.frachtbriefdata.ubernahmeort.bahnhof.name)

const ubernahmeCode = form.getTextField('Code lieu prise charge17')
ubernahmeCode.setText(json.frachtbriefdata.ubernahmeort.bahnhof.laendercode+'-'+json.frachtbriefdata.ubernahmeort.bahnhof.bahnhofscode)


const ubernahmeOrtDate = form.getTextField('Mois/jour/heure')
let monat = json.frachtbriefdata.ubernahmeort.datum.substring(5,7)
let tag = json.frachtbriefdata.ubernahmeort.datum.substring(8,10)
let stunde = json.frachtbriefdata.ubernahmeort.datum.substring(11,13)
ubernahmeOrtDate.setText(monat + tag + stunde)



if (ridcheck){


const checkBox = form.getCheckBox('RID23')
checkBox.check()

}


const wagennummer = form.getTextField('Wagon n°0-18')
wagennummer.setText('gem. Ladeliste')


const radioGroupCIMCUV = form.getRadioGroup('Gruppieren1')
if(json.frachtbriefdata.type == 'CUV'){
  radioGroupCIMCUV.select('Auswahl2')
} else {
  radioGroupCIMCUV.select('Auswahl1')
}

let z = 0;
for(i in nhmdata){
  if(nhmdata[i].nhm != 'gesamtsumme'){
    const nhmfeld = form.getTextField('NHM Code' + i)
    nhmfeld.setText(nhmdata[i].nhm)

    const masse = form.getTextField('Masse' + i)
    masse.setText(nhmdata[i].summe + " kg")
  }
  z = i
}

z= z++;

const massesumme = form.getTextField('Masse' + z)
    massesumme.setText('SUMME')

    z= z++;
    const massegessumme = form.getTextField('Masse' + z)
    massegessumme.setText(nhmdata[z].summe + " kg")




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


const firstDonorPdfDoc = await PDFDocument.load(fs.readFileSync(dateinameLadeliste))

const totalPages = firstDonorPdfDoc.getPageCount()
for(i = 0; i < totalPages; i++){
console.log(i)
const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
await pdfDoc.addPage(firstDonorPage)
}


for(i = totalPages-1; i >= 0; i--){
  console.log(i)
  const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
  await pdfDoc.insertPage(8, firstDonorPage)
  }

  for(i = totalPages-1; i >= 0; i--){
    console.log(i)
    const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
    await pdfDoc.insertPage(6, firstDonorPage)
    }


    for(i = totalPages-1; i >= 0; i--){
      console.log(i)
      const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
      await pdfDoc.insertPage(4, firstDonorPage)
      }
for(i = totalPages-1; i >= 0; i--){
  console.log(i)
  const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
  await pdfDoc.insertPage(2, firstDonorPage)
  }






 
// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()






const blob = Buffer.from(pdfBytes);
await pdfService.create({pdf: blob})
  .then( async (item) => {
    
    await frachtbriefService.update(json.id, {pdf_id_komplett: item.id})})




fs.unlink(dateinameLadeliste, (err) => {
  if (err) {
    console.error(err)
    return
  }} )

console.log(nhmdata)

return await frachtbriefService.getById(json.id);





}



































async function createPDF(json) {


//const frachtid = req.params.id;
    

 
  


// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)


const form = pdfDoc.getForm()
const absender = form.getTextField('Expéditeur1')
absender.setText([json.frachtbriefdata.adresse1.name, json.frachtbriefdata.adresse1.strasse, json.frachtbriefdata.adresse1.ort].join('\n'))


const absenderMail = form.getTextField('E-Mail0')
absenderMail.setText("\n" + formatMail(json.frachtbriefdata.adresse1.mail))


const absenderTel = form.getTextField('Tel0')
absenderTel.setText(json.frachtbriefdata.adresse1.telefon)







const ablieferungsOrtCode = form.getTextField('DIUM12')
ablieferungsOrtCode.setText(json.frachtbriefdata.bahnhof7.laendercode + json.frachtbriefdata.bahnhof7.bahnhofscode)

const ablieferungsOrtBahnhof = form.getTextField('Gare')
ablieferungsOrtBahnhof.setText(json.frachtbriefdata.bahnhof7.name)

const ablieferungsOrtLand = form.getTextField('Pays')
ablieferungsOrtLand.setText(json.frachtbriefdata.bahnhof7.land)


const empfanger = form.getTextField('Destinataire4')
empfanger.setText([" ",json.frachtbriefdata.adresse2.name, json.frachtbriefdata.adresse2.strasse, json.frachtbriefdata.adresse2.ort].join('\n'))

const empfangerMail = form.getTextField('E-Mail')
empfangerMail.setText("\n" + formatMail(json.frachtbriefdata.adresse2.mail))

const empfangerTel = form.getTextField('Tel')
empfangerTel.setText(json.frachtbriefdata.adresse2.telefon)


const erklarungAbsender = form.getTextField('Déclaration expéditeur7')
erklarungAbsender.setText(json.frachtbriefdata.erklarung.code)

const absenderRef = form.getTextField('Info destinataire15')
absenderRef.setText(json.frachtbriefdata.refnr)

const absenderRef2 = form.getTextField('Référence Expéditeur8')
absenderRef2.setText(json.frachtbriefdata.refnr)


const ortDatumAusstellung = form.getTextField('Lieu et date d\'établissement29')
ortDatumAusstellung.setText(json.frachtbriefdata.ausstellung.ort+' '+(json.frachtbriefdata.ausstellung.datum).slice(0, 10).split('-').reverse().join('/'))

const bezeichnungGut = form.getTextField('Description21')
bezeichnungGut.setText(json.frachtbriefdata.bezeichnungGut)

const kommerzBed = form.getTextField('Conditions commerciales13')
kommerzBed.setText(json.frachtbriefdata.kommerziellebedingungen)

const ubernahmeOrt = form.getTextField('Lieu2-16')
ubernahmeOrt.setText(json.frachtbriefdata.ubernahmeort.bahnhof.name)

const ubernahmeCode = form.getTextField('Code lieu prise charge17')
ubernahmeCode.setText(json.frachtbriefdata.ubernahmeort.bahnhof.laendercode+'-'+json.frachtbriefdata.ubernahmeort.bahnhof.bahnhofscode)


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


 


}

function formatWagennummer(wagennummer){
  var wagennummer2 = wagennummer.slice(0,2) + " " + wagennummer.slice(2, 4) + " " + wagennummer.slice(4, 8) + " " + wagennummer.slice(8, 11) + "-" + wagennummer.slice(11);


  return wagennummer2

}
function numberWithCommas(x) {
  return x.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function formatMail(x){
  if(x.length <= 27) return x
  else{
    return x.slice(0,27) + "\n" + x.slice(27)
  }
}