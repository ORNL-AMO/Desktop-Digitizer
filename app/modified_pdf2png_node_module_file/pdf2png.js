var exec = require('child_process').exec;
var tmp = require('tmp');
var fs = require('fs');
var filesource = require('filesource');
const isDev = require('electron-is-dev'); //this does not work when working in dev mode...look for other solution to differentiate

var initialized = false;
var ghostscriptPath;

console.log(__dirname);
if (process.platform === 'win32'){
    var projectPath = __dirname.split("\\");

    if(isDev){
        projectPath.pop();
        projectPath.pop();
        ghostscriptPath = projectPath.join("\\") + "\\executables\\ghostScript\\";
    } else {
        projectPath.pop();
        projectPath.pop();
        projectPath.pop();
        projectPath.pop();
        ghostscriptPath = projectPath.join("\\") + "\\app.asar.unpacked\\node_modules\\executables\\ghostScript\\";
    }


}else {
    var projectPath = __dirname.split('/');

    if(isDev){
        projectPath.pop();
        projectPath.pop();
        ghostscriptPath = projectPath.join('/') + "/executables/ghostScript/";
    }else{
        projectPath.pop();
        projectPath.pop();
        projectPath.pop();
        projectPath.pop();
        ghostscriptPath = projectPath.join('/') + "/app.asar.unpacked/node_modules/executables/ghostScript/";
        console.log(ghostscriptPath);
    }
}

exports.convert = function() {
    var filepathOrData = arguments[0];
    var callback = arguments[1];
    var options = {};

    var tmpFileCreated = false;

    if(arguments[2] != null)
    {
        options = arguments[1];
        callback = arguments[2];
    }

    if(!initialized)
    {
        if(!options.useLocalGhostscript)
        {
            process.env.Path += ";" + exports.ghostscriptPath;
            console.log('here');
        }

        initialized = true;
    }

    options.quality = options.quality || 100;

    filesource.getDataPath(filepathOrData, function(resp){
        if(!resp.success)
        {
            callback(resp);
            return;
        }

        // get temporary filepath
        tmp.file({ postfix: ".png" }, function(err, imageFilepath, fd) {
            if(err)
            {
                callback({ success: false, error: "Error getting second temporary filepath: " + err });
                return;
            }

            exec(ghostscriptPath + "gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r" + options.quality + " -dFirstPage=1 -dLastPage=1 -sOutputFile=" + imageFilepath + " " + resp.data, function (error, stdout, stderr) {
                // Remove temp files
                resp.clean();

                if(error !== null)
                {
                    callback({ success: false, error: "Error converting pdf to png: " + error });
                    return;
                }

                if(options.returnFilePath)
                {
                    callback({ success: true, data: imageFilepath });
                    return;
                }

                var img = fs.readFileSync(imageFilepath);

                // Remove temp file
                fs.unlink(imageFilepath);

                callback({ success: true, data: img });
            });
        });
    });
};
