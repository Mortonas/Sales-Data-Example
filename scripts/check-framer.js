import * as Framer from 'framer-motion';

console.log('Framer keys:', Object.keys(Framer));
console.log('AnimatePresence:', Framer.AnimatePresence);
console.log('motion:', Framer.motion);

if (!Framer.motion) {
    console.error('ERROR: motion export missing!');
}
if (!Framer.AnimatePresence) {
    console.error('ERROR: AnimatePresence export missing!');
}
