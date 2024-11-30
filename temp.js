const escpos = require('escpos');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type

// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
// const device = escpos.USB.findPrinter();

// const device = new escpos.USB(1659, 8965);
const device = new escpos.USB();

console.log(device);
const options = { width: 40 }
// encoding is optional

const printer = new escpos.Printer(device, options);
printer.marginLeft(0);
printer.marginRight(0);
device.open(function(error){
//   printer.encode('utf16le');
//   printer.text('شكرا لكم لطلبكم من مطعكم المفضل نتمة لكم يوما جميل جدا جدا جدا يا اخي العزيز', 'cp866');
 
// //   printer.encode('cp866').model(null).marginLeft(20).text('This is a sample of a long English text that will be printed on the receipt. The text can contain multiple sentences and will wrap automatically based on the printer width. This demonstrates the basic text printing capabilities of the ESC/POS printer. Thank you for your business!');

  
//   printer.tableCustom(
//     [
//       { text:"Left", align:"CENTER", width:0.30,  },
//       { text:"Center", align:"CENTER", width:0.30},
//       { text:"Right", align:"CENTER", width:0.30 }
//     ],
    
  
printer.align('LT'); // Align to the left
  printer.size(0, 0);  // Use the default size for the text
printer.text('This is a sample of a long English text that will be printed on the receipt. The text can contain multiple sentences and will wrap automatically based on the printer width. This demonstrates the basic text printing capabilities of the ESC/POS printer. Thank you for your business!');
  // Print a table with three columns
  printer.tableCustom([
    { text: 'Item', align: 'LEFT', width: 0.3 },   // First column, left-aligned, 30% width
    { text: 'Qty', align: 'CENTER', width: 0.3 }, // Second column, center-aligned, 30% width
    { text: 'Price', align: 'RIGHT', width: 0.3 } // Third column, right-aligned, 40% width
  ]);

  // Print multiple rows
  printer.tableCustom([
    { text: 'Apple', align: 'LEFT', width: 0.3 },
    { text: '2', align: 'CENTER', width: 0.3 },
    { text: '$1.00', align: 'RIGHT', width: 0.3 }
  ]);

  printer.tableCustom([
    { text: 'Orange', align: 'LEFT', width: 0.3 },
    { text: '5', align: 'CENTER', width: 0.3 },
    { text: '$0.80', align: 'RIGHT', width: 0.3 }
  ]);

  // Print a total
  printer.drawLine(); // Draw a separator line
  printer.tableCustom([
    { text: 'Total', align: 'LEFT', width: 0.3 },
    { text: '', align: 'CENTER', width: 0.3 },
    { text: '$5.00', align: 'RIGHT', width: 0.3 }
  ]);
  printer.close()
});
