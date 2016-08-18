This folder contains the modified version of the pdf2png node module js file along with the ghostscript
executables for Windows.

Also need to install electron-is-dev module from https://www.npmjs.com/package/electron-is-dev

Replace this modified version of pdf2png.js with the one installed from running 'npm install pdf2png' found at
https://www.npmjs.com/package/pdf2png.

Take out the executables folder and place it in the node_modules folder to have the packager automatically extract that folder
and place under app.asar.unpacked folder.

Then run 'npm run release'
