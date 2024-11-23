const { getPrinters, print } = require('unix-print');

const get = async () => {
    const printers = await getPrinters();
    if (printers.length > 0) {
        printers.forEach(printer => {
            if (printer.printer.includes('Prolific_Technology_Inc__IEEE_1284_Controller')) {
                print( 'assets/test.pdf', printer.printer);
            }
        });
    } else {
        console.log('No printers found');
    }
}

get();