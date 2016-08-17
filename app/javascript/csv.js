

var fs = require('fs');
var jsonfile = require('jsonfile');
var csvWriter = require('csv-write-stream');

var wpd = wpd || {};

wpd.writeFile = (function () {


    function writeData(data, filename, format){

        if(format == 'csv'){
            dialog.showSaveDialog({filters:[{name:'Comma Separated Values (*.csv)', extensions:['csv']}]},function (fileName) {
                if (fileName === undefined){
                    console.log("You didn't save the file");
                    return;
                }

                var writer = csvWriter({headers: ['x', 'y']});
                writer.pipe(fs.createWriteStream(fileName));
                var i;
                for(i = 0;i < data.length;i++){
                    writer.write(data[i]);
                }
                writer.end();
                alert("The file has been succesfully saved");
            });
        }

        if(format == 'json'){
            dialog.showSaveDialog({filters:[{name:'JavaScript Object Notation (*.json)', extensions:['json']}]},function (fileName) {
                if (fileName === undefined){
                    console.log("You didn't save the file");
                    return;
                }

                console.log(data);
                jsonfile.writeFile(fileName, data, function (err) {
                    console.error(err);
                });
                alert("The file has been succesfully saved");
            });
        }

    }

    return{
        writeData: writeData
    }

})();



