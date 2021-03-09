var fs = require('fs');
const pdfService = require('./pdf.service');
const ladelisteService = require('./ladeliste.service');
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


const existingPdfBytes = fs.readFileSync('./ladeliste/cim.pdf')


module.exports = {
    createPDF,
    getPDF

}

const dateinameLadeliste = Math.random().toString(36).substring(7);

async function createPDF(json) {
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
      ['Absender\n Name Absender\n Land-PLZ Ort', 'Empfänger\n [Name Empfänger]\n [Land-PLZ Ort]', 'Datum\n [Abweichendes Feld zu 29]'],
      ['Abgangsbahnhof\n [Abgangsbahnhof]-[Land]', 'Zielbahnhof\n [Zielbahnhof Name]-[Land]', 'Referenz\n'+json.ladelistedata.refnr]
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
          [{text: 'Nr.', fontSize: 8}, {text: 'Wagennummer', fontSize: 8}, {text: 'Achs.', fontSize: 8}, {text: 'Bezeichnung des Gutes', fontSize: 8, alignment: 'center'}, {text: 'Liter', fontSize: 8}, {text: 'Dichte', fontSize: 8}, {text: 'RID', fontSize: 8}, {text: 'Masse\nLadung (kg)', fontSize: 8}, {text: 'Tara Wagen\n(kg)', fontSize: 8}, {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
          
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
         {text: numberWithCommas((((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000).toFixed(3))), fontSize: 8}, 
         {text: numberWithCommas(json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht), fontSize: 8}, 
         {text: numberWithCommas((((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte)/1000) + json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht).toFixed(3)), fontSize: 8}],
)
      i++;
    }



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


  console.log(1)
  var pdfDoc = printer.createPdfKitDocument(docDefinition1)
  pdfDoc.pipe(await fs.createWriteStream(dateinameLadeliste));
  pdfDoc.end();
  await sleep(2000);
  console.log(2)
  const existingPdfBytes = await fs.readFileSync(dateinameLadeliste)
  const firstDonorPdfDoc = await PDFDocument.load(existingPdfBytes)
  const pdfBytes = await firstDonorPdfDoc.save()
  console.log(3)
  const blob = Buffer.from(pdfBytes);
await pdfService.create({pdf: blob})
  .then( async (item) => {
    
    await ladelisteService.update(json.id, {pdf_id: item.id})})

console.log('pdf durch')
console.log(dateinameLadeliste)


fs.unlink(dateinameLadeliste, (err) => {
  if (err) {
    console.error(err)
    return
  }} )











  






  
  return await ladelisteService.getById(json.id);
  
}

async function getPDF(id) {

const obj = await pdfService.getById(id)

const ausdb = Uint8Array.from(obj.pdf);


 

fs.writeFile('test2.pdf', ausdb, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

function formatWagennummer(wagennummer){
  var wagennummer2 = wagennummer.slice(0,2) + " " + wagennummer.slice(2, 4) + " " + wagennummer.slice(4, 8) + " " + wagennummer.slice(8, 11) + "-" + wagennummer.slice(11);


  return wagennummer2

}



function numberWithCommas(x) {
  return x.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
