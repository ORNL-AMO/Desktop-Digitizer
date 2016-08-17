#Desktop Digitizer

This is a modification and enhancement of the existing WebPlotDigitizer by Ankit Rohatgi which is available via Open Source GPLv3 licensing. The Desktop Digitizer will form part of the Advanced Manufacturing Office's software suite by Department of Energy (DOE). The purpose of this tool is to facilitate the extraction of numerical data from a digitial representation of a performance curve by plotting the curve to a discrete set of x and y coordinates that can be exported to comma separated values (CSV) files.   

##This is achieved by the following:

###Electron

* This is the Javascript framework used to port the web application as a desktop application to be used on Windows, Mac, and Linux. 

###Removing PHP and other unnecessary scripts/dependencies

* The original WebPlotDigitizer utilized a minimal portion of PHP for file upload/download functionality which was replaced by Electron's file system functionality.

* Python and R scripts were removed as they had no real impact to the functionality of the application.

###Added PDF Functionality

* Application is able to accept pdf files, by converting them to png files and then displaying them on the canvas.
