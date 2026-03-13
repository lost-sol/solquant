import * as sharpPkg from 'sharp';
import sharpDefault from 'sharp';

console.log('sharpPkg keys:', Object.keys(sharpPkg));
console.log('sharpDefault type:', typeof sharpDefault);
if (sharpDefault) {
    console.log('sharpDefault keys:', Object.keys(sharpDefault));
}
