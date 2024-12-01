const PDFDocument = require('pdfkit');
const fs = require('fs');
const {print} = require('pdf-to-printer')
var TwitterCldrLoader = require('twitter_cldr');
const isHebrew = (text) => {
    return text.search(/[\u0590-\u05FF]/) >= 0;
  };
  
  const isArabic = (text) => {
    return text.search(/[\u0600-\u06FF]/) >= 0;
  };
  
  
  revNumsInString = (s) => {
    
    var x = 0, keep = "", r = 0;
    s.replace(/(?:[\d])/gi, (i, q) => {keep += (r == q - 1 ? "" : "|") + i; r = q;});
    keep = keep.split("|").map(x => x.split("").reverse().join("")).join("");
    return s.replace(/(?:[\d])/gi, (i) =>keep[x++]);
}
async function generateReceipt(orderData) {
  const headers = ['السعر', 'الكمية', 'العنصر'];
    const data = [
      ['$5.00', '1', 'قهوة'],
      ['$3.00', '2', 'كعك عربي'],
      ['$4.00', '1', 'كعك xl مرتب'],
      ['$5.00', '1', 'قهوة'],
      ['$3.00', '2', 'كعك عربي'],
      ['$4.00', '1', 'كعك xl مرتب'],
      ['$5.00', '1', 'قهوة'],
      ['$3.00', '2', 'كعك عربي'],
      ['$4.00', '1', 'كعك xl مرتب'],
      ['$5.00', '1', 'قهوة'],
      ['$3.00', '2', 'كعك عربي'],
      ['$4.00', '1', 'كعك xl مرتب'],
      ['$5.00', '1', 'قهوة'],
      ['$3.00', '2', 'كعك عربي'],
      ['$3.00', '2', 'كعك عربي'],
      ['$4.00', '1', 'كعك xl مرتب']
    ];
    // Calculate required page height based on data length
    const rowHeights = 30;
    const headerHeight = 40;
    const footerHeight = 40;
    const requiredHeight = (data.length * rowHeights) + headerHeight + footerHeight;
    
    const doc = new PDFDocument({
        size: [226.772, Math.max(280, requiredHeight+100)],
        margins: {
            top: 10,
            bottom: 0,
            left: 0,
            right: 0
        },
        compress: false,
        pdfVersion: '1.4',
        autoFirstPage: true,
        layout: 'portrait'
    });
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('NotoSansArabic-VariableFont_wdth,wght.ttf', {
        subset: true,
        fill: true,
        weight: 900
    });

    doc.fontSize(13);
    doc.lineGap(-2);

    
    
    // Adjusted starting positions and dimensions
    let startX = 0, startY = 35;
    const columnWidths = [60, 45, 101.772];
    const rowHeight = 30;
    const padding = 6;
    
    // Draw the table headers with borders
    headers.forEach((header, i) => {
        doc.text(header, startX + padding, startY, { 
            width: columnWidths[i] - 2 * padding, 
            align: 'right',
            features: ['rlig'] 
        });
        doc.rect(startX, startY - 5, columnWidths[i], rowHeight).stroke();
        startX += columnWidths[i];
    });
    
    startY += rowHeight;
    
    // Draw the table rows with borders
    data.forEach(row => {
        startX = 0;
        row.forEach((text, i) => {
            doc.text(text, startX + padding, startY, { 
                width: columnWidths[i] - 2 * padding, 
                align: 'right', 
                features: ['rtla'],
                stroke: false,
                fill: true,
                renderingMode: 'fill'
            });
            doc.rect(startX, startY - 5, columnWidths[i], rowHeight).stroke();
            startX += columnWidths[i];
        });
        startY += rowHeight;
    });
    
    // Adjusted total position
    doc.text('Total: $12.00', 120, startY + 10);
    
    doc.end();
    setTimeout(() => {
        print('output.pdf', {
            printer: 'thermal',
            paperSize: '80mm x 297mm',
            scale: '1.0', 
            orientation: 'portrait',
            monochrome: true,
            silent: true,
            copies: 1
        })
    }, 1000);
}

// Example order data
const orderData = {
    orderId: "123456",
    items: [
        { name: "قهوة", quantity: 2, price: 15 },
        { name: "كعك عربي xl مرتب", quantity: 1, price: 10 }
    ],
    total: 40
};

// Test PDF generation
generateReceipt(orderData)
    .then(() => console.log('PDF generated successfully'))
    .catch(err => console.error('Error generating PDF:', err));


