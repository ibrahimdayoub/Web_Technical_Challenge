import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'; 
import { PDFDocument,StandardFonts} from 'pdf-lib'  
import fontkit from '@pdf-lib/fontkit'
import { saveAs } from 'file-saver';
import swal from 'sweetalert';

const DownloadCertificate = (props) => {

    const { info, detail, pdfArrayBuffer, fontsArrayBuffers} = props.location.state
    console.log("info",info) //texts
    console.log("detail",detail) //styles
    console.log("pdfArrayBuffer",pdfArrayBuffer) //certificate
    console.log("fontsArrayBuffers",fontsArrayBuffers) //fonts

    const [pdfUrl, setPdfUrl] = useState(null); //for show
    const [pdfDoc, setPdfDoc] = useState(null); //for save

    useEffect(()=>{
        modifyPdf(info, detail, pdfArrayBuffer, fontsArrayBuffers);
    },[]);

    const modifyPdf = async (info, detail, pdfArrayBuffer, fontsArrayBuffers) =>{
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
        pdfDoc.registerFontkit(fontkit);

        for(let i=0; i<Object.keys(detail).length; i++)
        {   
            const smObj = JSON.parse(detail[Object.keys(detail)[i]])
            //console.log("O",smObj)

            let font_type = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_type')));
            let font_size = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_size')));
            let font_color = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_color')));
            let x_position = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('x_position')));
            let y_position = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('y_position')));

            //console.log(font_type,font_color,x_position)

            font_type  = smObj[Object.keys(font_type)[0]]            //set it standard :)
            font_size  = parseInt(smObj[Object.keys(font_size)[0]])  ||  16
            font_color = smObj[Object.keys(font_color)[0]]           || "#000"
            x_position = parseInt(smObj[Object.keys(x_position)[0]]) ||  200
            y_position = parseInt(smObj[Object.keys(y_position)[0]]) ||  100

            //console.log(font_type,font_color,x_position)

            const hexToRGBA = (hex) => {
                return (hex = hex.replace('#', ''))
                    .match(new RegExp('(.{' + hex.length/3 + '})', 'g'))
                    .map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16) })    
            }

            font_color = {
                blue: hexToRGBA(font_color)[2],
                green:hexToRGBA(font_color)[1],
                red:hexToRGBA(font_color)[0],
                type:"RGB"
            }

            font_type = await font_type.split("/")[2]

            //console.log(font_type,font_color,x_position)

            font_type = fontsArrayBuffers[font_type] ? await pdfDoc.embedFont(fontsArrayBuffers[font_type]) : await pdfDoc.embedFont(StandardFonts.TimesRoman)

            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            firstPage.drawText(info[Object.keys(info)[i]], {
              x: x_position,
              y:y_position,
              size: font_size,
              font: font_type,
              color: font_color
            })
        }

        //Show Pdf
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfUrl(pdfDataUri)
        setPdfDoc(pdfDoc)
    }

    const savePdf = async() =>{
        console.log("save")
        const pdfBytes = await pdfDoc.save();
        var file = new File(
          [pdfBytes],
          info.user_name,
          {
            type: "application/pdf;charset=utf-8",
          }
        );
      saveAs(file);
      swal("Success","Your certificate saved successfully","success");
    }

    return (
        <div className="container px-4 w-100 p-2">
        <h1 className="my-4 d-none d-md-block">Download Certificate</h1>
        <i className="fa fa-download fa-3x text-primary my-4 d-md-none"></i>

        <div className="row my-5">
            <div className="d-flex justify-content-between my-2">
                <Link className="btn btn-sm btn-primary px-4 m-1 me-auto" to="/user/get_certificate"><i className="fa fa-chevron-left"></i></Link>
                <button className="btn btn-sm btn-primary px-4 m-1 ms-auto" onClick={savePdf}><i className="fa fa-download"></i></button>
            </div>
            <iframe style={{height:500}} className="w-100 rounded" title="test-frame" src={pdfUrl} type="application/pdf" />
        </div>

    </div>
    )
}

export default DownloadCertificate