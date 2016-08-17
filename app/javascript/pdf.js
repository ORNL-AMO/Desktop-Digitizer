var fs = require('fs');
var pdf2png = require('pdf2png');
// var app = require('electron');

// var imgPath;


var wpd = wpd || {};

wpd.pdfConverter = (function () {
    var imgPath;
    function convertToImage(pdfFile){
        var fileName = pdfFile.name.split('.');
        var dir = __dirname.split('/');
        dir.pop();
        imgPath = dir.join('/') + '/' + fileName[0] + '.png';

        pdf2png.convert(pdfFile.path, function(resp){
            if(!resp.success)
            {
                console.log("Something went wrong: " + resp.error);
                return;
            }

            fs.writeFile(imgPath, resp.data, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("The file was saved!");
                }
            });

        });

        return imgPath;
    }

    return{
        convertToImage: convertToImage
    }
})();


