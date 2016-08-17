var regression = require('regression');
require('chart.js');
var ipcRenderer = require('electron').ipcRenderer;

var wpd = wpd || {};

wpd.Regression = (function (){

    function showGraph(originalPoints, efficiencyPoints){
        var shadowDiv = document.getElementById('shadow');
        shadowDiv.style.visibility = "visible";
        ipcRenderer.send('showRegression', originalPoints, efficiencyPoints);
    }

    function calcOriPointsRegression(originalPoints, order){
        return regression('polynomial', originalPoints, order);
    }

    function calcEffPointsRegression(efficiencyPoints, order) {
        return regression('polynomial', efficiencyPoints, order);
    }

    function arrayToObject(arr){
        return arr.map(function(d){
            return{
                x:d[0],
                y:d[1]
            }
        });
    }

    return {
        showGraph: showGraph,
        calcOriPointsRegression: calcOriPointsRegression,
        calcEffPointsRegression: calcEffPointsRegression,
        arrayToObject: arrayToObject
    }
})();

ipcRenderer.on('makeMainWindowVisible', function(){
    var shadowDiv = document.getElementById('shadow');
    shadowDiv.style.visibility = "hidden";
});



