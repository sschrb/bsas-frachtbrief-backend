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
        widths: ['auto', 'auto', 'auto', 145,'auto', 'auto', 'auto','auto', 'auto', 'auto'],
        body: [
          [{text: 'Nr.', fontSize: 8}, {text: 'Wagennummer', fontSize: 8}, {text: 'Achs-\n anzahl', fontSize: 8}, {text: 'Bezeichnung des Gutes', fontSize: 8, alignment: 'center'}, {text: 'Liter', fontSize: 8}, {text: 'Dichte', fontSize: 8}, {text: 'RID', fontSize: 8}, {text: 'Masse\nLadung (kg)', fontSize: 8}, {text: 'Tara Wagen\n(kg)', fontSize: 8}, {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
          
                  ]
      }
    }
    for(wagen in json.ladelistedata[ladegut].wagen){
      console.log(json.ladelistedata[ladegut].wagen[wagen])

      zwischensumme.masse= (json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte) + zwischensumme.masse;
      zwischensumme.liter= Number(json.ladelistedata[ladegut].wagen[wagen].liter) + zwischensumme.liter
      zwischensumme.tara=json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht + zwischensumme.tara
      zwischensumme.bruttogew=(json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte) + json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht + zwischensumme.bruttogew

      basetable.table.body.push( [{text: i, fontSize: 8}, {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.wagennummer, fontSize: 8},
         {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.achsanzahl, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.bezeichnung, fontSize: 8, alignment: 'center'}, 
         {text: json.ladelistedata[ladegut].wagen[wagen].liter, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.dichte, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.rid, fontSize: 8}, 
         {text: (json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte).toFixed(2), fontSize: 8}, 
         {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht, fontSize: 8}, 
         {text: ((json.ladelistedata[ladegut].wagen[wagen].liter*json.ladelistedata[ladegut].ladegut.dichte) + json.ladelistedata[ladegut].wagen[wagen].wagendaten.eigengewicht).toFixed(2), fontSize: 8}],
)
      i++;
    }



    basetable.table.body.push([{text: 'Zwischensumme:', colSpan: 4, fontSize: 8, alignment: 'right' },{},{},{}, {text: zwischensumme.liter.toFixed(2), fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: zwischensumme.masse.toFixed(2), fontSize: 8}, {text: zwischensumme.tara.toFixed(2), fontSize: 8}, {text: zwischensumme.bruttogew.toFixed(2), fontSize: 8}],
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
              [{text: 'Gesamtsumme:', fontSize: 8, alignment: 'right' }, {text: gesamtsumme.liter.toFixed(2)+'\n(I Ladung)', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: gesamtsumme.masse.toFixed(2)+'\n(kg Ladung)', fontSize: 8}, {text: gesamtsumme.tara+'\n(kg Tara)', fontSize: 8}, {text:gesamtsumme.bruttogew.toFixed(2)+'\n(kg Brutto)', fontSize: 8}],
  
                    ]
        }
      },

)


  
  var pdfDoc = printer.createPdfKitDocument(docDefinition1)
    

  let buffers = [];
  pdfDoc.on('data', buffers.push.bind(buffers));
  pdfDoc.on('end', async () => {

    let pdfData = Buffer.concat(buffers);

    console.log(buffers)
    console.log('#############################################################################################################')
    console.log(pdfData)
    await pdfService.create({pdf: pdfData})
    .then( async (item) => {
      
      await ladelisteService.update(json.id, {pdf_id: item.id})})
  
  console.log('pdf durch')

});


//end buffer
pdfDoc.end();
  






  
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
