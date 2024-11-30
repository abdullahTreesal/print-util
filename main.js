const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const ArabicReshaper = require('arabic-reshaper');
const arabicText = ArabicReshaper.convertArabic('أسعد الله أوقاتكم');

const device = new escpos.USB();
const printer = new escpos.Printer(device);

device.open((error) => {
  if (error) {
    console.error('Error opening USB device:', error);
    return;
  }

  // Reverse the Arabic text before printing
//   const arabicText = 'أسعد الله أوقاتكم'
const encodings = ['utf8', 'windows-1256', 'iso-8859-6' , 'arabic'];

// Loop through code tables from 25 to 28
   for (let codeTable = 20; codeTable <= 28; codeTable++) {
     encodings.forEach(encoding => {
       // Convert the text to the specified encoding


       printer.setCharacterCodeTable(codeTable)
         .align('RT')
         .font('a')
         .text(`Table ${codeTable}, Encoding ${encoding}: ${arabicText.toString('binary')}`, encoding) // Sending as binary to ensure raw data handling
      
     });
   }
   printer.close();
});