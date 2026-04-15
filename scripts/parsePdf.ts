import fs from 'fs';
const pdf = require('pdf-parse');

async function main() {
    const filePath = '/Users/sehopark/Desktop/Karen-Dic2/dictionary-_karen-to-english_unknown_source.pdf';
    console.log(`Reading PDF: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);
    
    const options = {
        max: 5 // Extract up to 5 pages
    };
    
    try {
        const data = await pdf(dataBuffer, options);
        console.log("--- Extracted Text ---");
        console.log(data.text.substring(0, 3000));
        console.log("----------------------");
    } catch (e) {
        console.error("Error extracting PDF:", e);
    }
}

main();
