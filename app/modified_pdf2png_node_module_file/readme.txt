This folder contains the modified version of the pdf2png node module js file along with the ghostscript
executables for Windows and Mac.

Also need to install electron-is-dev module from https://www.npmjs.com/package/electron-is-dev

Replace this modified version of pdf2png.js with the one installed from running 'npm install pdf2png' found at
https://www.npmjs.com/package/pdf2png.

Electron packager will unpack the folder to the executables use this command:

"electron-packager . $npm_package_productName --out=dist --ignore='^/dist$' --prune --asar.unpackDir='node_modules/pdf2png/executables/' --all --version=$npm_package_electronVersion"
