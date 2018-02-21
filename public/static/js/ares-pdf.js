
// NOTE: `pdfMake` is loaded in HTML through pdfmake.min.js

var downloadReport = function() {
    pdfMake.createPdf(content()).open();
};

var content = function() {
    return {
        content: [
            { text: 'Reporte de incidencias criminales', style: 'heading_one' },
            { text: 'Mapa', style: 'heading_two' },
            {
                columns: [
                    {
                        width: '50%',
                        style: 'heading_two',
                        text: 'Gráfica de pastel'
                    },
                    {
                        width: '50%',
                        style: 'table',
                        table: {
                            headerRows: 1,
                            widths: [ '50%', '50%'],
                            body: [
                                [ 'Zona', 'Concentración' ],
                                [ '1', '14%'],
                                [ '2', '8%' ],
                                [ '3', '9%' ],
                                [ '4', '7%' ],
                                [ '5', '12%' ]
                            ]
                        }
                    }
                ],
                columnGap: 10
            },
            { text: 'Serie de tiempo', style: 'heading_two' },
        ],
        styles: {
            heading_one: {
                alignment: 'center',
                fontSize: 22,
                margin: 10,
                bold: true
            },
            heading_two: {
                alignment: 'center',
                fontSize: 18,
                margin: 10,
                bold: true
            },
            table: {
                margin: 10
            }
        }
    };
};

// getScreenshotOfElement($("div#toBeCaptured").get(0), 0, 0, 100, 100, function(data) {
//     // in the data variable there is the base64 image
//     // exmaple for displaying the image in an <img>
//     $("img#captured").attr("src", "data:image/png;base64,"+data);
// });

// function getScreenshotOfElement(element, posX, posY, width, height, callback) {
//     html2canvas(element, {
//         onrendered: function (canvas) {
//             var context = canvas.getContext('2d');
//             var imageData = context.getImageData(posX, posY, width, height).data;
//             var outputCanvas = document.createElement('canvas');
//             var outputContext = outputCanvas.getContext('2d');
//             outputCanvas.width = width;
//             outputCanvas.height = height;

//             var idata = outputContext.createImageData(width, height);
//             idata.data.set(imageData);
//             outputContext.putImageData(idata, 0, 0);
//             callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
//         },
//         width: width,
//         height: height,
//         useCORS: true,
//         taintTest: false,
//         allowTaint: false
//     });
// }
