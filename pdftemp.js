const PDFDocument = require('pdfkit');
const fs = require('fs');
const { print } = require("unix-print");

async function generateReceipt(orderData) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('NotoSansArabic-VariableFont_wdth,wght.ttf');

    // Company header
    doc.fontSize(24)
       .text('اسم الشركة', {
           align: 'center',
           y: 100,
           direction: 'rtl'
       });

    // Order details
    doc.fontSize(12)
       .text(`رقم الطلب: ${orderData.orderId}`, {
           align: 'right',
           y: 150,
           direction: 'rtl'
       })
       .text(`التاريخ: ${new Date().toLocaleDateString('ar-SA')}`, {
           align: 'right',
           y: 170,
           direction: 'rtl'
       });

    // Table header
    const tableTop = 220;
    const itemX = 400;
    const qtyX = 300;
    const priceX = 200;
    const totalX = 100;

    doc.fontSize(14)
       .text('المنتج', itemX, tableTop, { align: 'right', direction: 'rtl' })
       .text('الكمية', qtyX, tableTop, { align: 'right', direction: 'rtl' })
       .text('السعر', priceX, tableTop, { align: 'right', direction: 'rtl' })
       .text('المجموع', totalX, tableTop, { align: 'right', direction: 'rtl' });

    // Draw table lines
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();

    // Items list in table format
    let yPosition = tableTop + 40;
    orderData.items.forEach(item => {
        doc.fontSize(12)
           .text(item.name, itemX, yPosition, { align: 'right', direction: 'rtl' })
           .text(item.quantity.toString(), qtyX, yPosition, { align: 'right', direction: 'rtl' })
           .text(`${item.price} ر.س`, priceX, yPosition, { align: 'right', direction: 'rtl' })
           .text(`${item.quantity * item.price} ر.س`, totalX, yPosition, { align: 'right', direction: 'rtl' });
        
        yPosition += 25;
    });

    // Draw bottom line
    doc.moveTo(50, yPosition)
       .lineTo(550, yPosition)
       .stroke();

    // Total
    doc.fontSize(14)
       .text(`المجموع الكلي: ${orderData.total} ر.س`, {
           y: yPosition + 20,
           align: 'right',
           direction: 'rtl'
       });

    doc.end();
    print('output.pdf');
}

// Example order data
const orderData = {
    orderId: "123456",
    items: [
        { name: "قهوة عربية", quantity: 2, price: 15 },
        { name: "كعك", quantity: 1, price: 10 }
    ],
    total: 40
};

// Generate the receipt with the provided order data
generateReceipt(orderData);
