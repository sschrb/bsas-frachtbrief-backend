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
for(ladegut in json.ladelistedata){
  //console.log(json.ladelistedata[ladegut].ladegut)
  if(json.ladelistedata[ladegut].ladegut && json.ladelistedata[ladegut].ladegut.nhm){

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
      basetable.table.body.push( [{text: i, fontSize: 8}, {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.wagennummer, fontSize: 8},
         {text: json.ladelistedata[ladegut].wagen[wagen].wagendaten.achsanzahl, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.bezeichnung, fontSize: 8, alignment: 'center'}, 
         {text: json.ladelistedata[ladegut].wagen[wagen].liter, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.dichte, fontSize: 8}, 
         {text: json.ladelistedata[ladegut].ladegut.rid, fontSize: 8}, 
         {text: 'Masse\nLadung (kg)', fontSize: 8}, 
         {text: 'Tara Wagen\n(kg)', fontSize: 8}, 
         {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
)
      i++;
    }



    basetable.table.body.push([{text: 'Zwischensumme:', colSpan: 4, fontSize: 8, alignment: 'right' },{},{},{}, {text: 'Summe', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'Summe', fontSize: 8}, {text: 'Summe', fontSize: 8}, {text:'Summe', fontSize: 8}],
    )




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
              [{text: 'Gesamtsumme:', fontSize: 8, alignment: 'right' }, {text: 'Summe\n(I Ladung)', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'Summe\n(kg Ladung)', fontSize: 8}, {text: 'Summe\n(kg Tara)', fontSize: 8}, {text:'Summe\n(kg Brutto)', fontSize: 8}],
  
                    ]
        }
      },

)



  var docDefinition = {
    content: [
      
      {text:'Ladeliste', fontSize: 14},
      ' ',
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*', '*'],
          body: [
            ['Absender\n Name Absender\n Land-PLZ Ort', 'Empfänger\n [Name Empfänger]\n [Land-PLZ Ort]', 'Datum\n [Abweichendes Feld zu 29]'],
            ['Abgangsbahnhof\n [Abgangsbahnhof]-[Land]', 'Zielbahnhof\n [Zielbahnhof Name]-[Land]', 'Referenz\n [siehe Feld 8]']
          ]
        }
      },
      ' ',
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          // dontBreakRows: true,
          keepWithHeaderRows: 1,
          widths: ['auto', 'auto', 'auto', 145,'auto', 'auto', 'auto','auto', 'auto', 'auto'],
          body: [
            [{text: 'Nr.', fontSize: 8}, {text: 'Wagennummer', fontSize: 8}, {text: 'Achs-\n anzahl', fontSize: 8}, {text: 'Bezeichnung des Gutes', fontSize: 8, alignment: 'center'}, {text: 'Liter', fontSize: 8}, {text: 'Dichte', fontSize: 8}, {text: 'RID', fontSize: 8}, {text: 'Masse\nLadung (kg)', fontSize: 8}, {text: 'Tara Wagen\n(kg)', fontSize: 8}, {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
            [{text: 'Nr.', fontSize: 8}, {text: 'Wagennummer', fontSize: 8}, {text: 'Achs-\n anzahl', fontSize: 8}, {text: 'Bezeichnung des Gutes', fontSize: 8, alignment: 'center'}, {text: 'Liter', fontSize: 8}, {text: 'Dichte', fontSize: 8}, {text: 'RID', fontSize: 8}, {text: 'Masse\nLadung (kg)', fontSize: 8}, {text: 'Tara Wagen\n(kg)', fontSize: 8}, {text:'Brutto Gew.\nWagen (kg)', fontSize: 8}],
            [{text: 'Zwischensumme:', colSpan: 4, fontSize: 8, alignment: 'right' },{},{},{}, {text: 'Summe', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'Summe', fontSize: 8}, {text: 'Summe', fontSize: 8}, {text:'Summe', fontSize: 8}],
  
                    ]
        }
      },
      ' ',
      
      {text:'Bemerkung:\n Bemerkung Ladegut 1', fontSize: 8},
      ' ',
      {text:'NHM-Code: Code Ladegut1', fontSize: 8},
      
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
              [{text: 'Gesamtsumme:', fontSize: 8, alignment: 'right' }, {text: 'Summe\n(I Ladung)', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'n.n.', fontSize: 8}, {text: 'Summe\n(kg Ladung)', fontSize: 8}, {text: 'Summe\n(kg Tara)', fontSize: 8}, {text:'Summe\n(kg Brutto)', fontSize: 8}],
  
                    ]
        }
      },
    ]
  };
  
  var pdfDoc = printer.createPdfKitDocument(docDefinition1);
 
  pdfDoc.pipe(fs.createWriteStream('basics.pdf'));
  pdfDoc.end();
  


}

async function getPDF(id) {

const obj = await pdfService.getById(id)

const ausdb = Uint8Array.from(obj.pdf);


 

fs.writeFile('test2.pdf', ausdb, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });
}
