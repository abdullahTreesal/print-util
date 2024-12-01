const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const {print} = require('unix-print')
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
    const rowHeights = 20;
    const headerHeight = 30; // Space for header
    const footerHeight = 30; // Space for total
    const requiredHeight = (data.length * rowHeights) + headerHeight + footerHeight;
    
    const doc = new PDFDocument({
        size: [226.772, Math.max(280, requiredHeight+100)], // Dynamic height with minimum of 280
        margins: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    });
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('NotoSansArabic-VariableFont_wdth,wght.ttf');

    doc.fontSize(8);

    
    
    // Adjusted starting positions and dimensions
    let startX = 20, startY = 30;
    const columnWidths = [50, 40, 106.772]; // Adjusted to fit the new width (total = 196.772)
    const rowHeight = 20; // Reduced row height
    const padding = 4; // Reduced padding
    
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
        startX = 20;
        row.forEach((text, i) => {
            doc.text(text, startX + padding, startY, { 
                width: columnWidths[i] - 2 * padding, 
                align: 'right', 
                features: ['rtla'] 
            });
            doc.rect(startX, startY - 5, columnWidths[i], rowHeight).stroke();
            startX += columnWidths[i];
        });
        startY += rowHeight;
    });
    
    // Adjusted total position
    doc.text('Total: $12.00', 120, startY + 5);
    
    doc.end();
    print('output.pdf')
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


