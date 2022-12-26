import React,{useState,useEffect} from 'react'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib' 
import fontkit from '@pdf-lib/fontkit'
import {saveAs} from 'file-saver' 
import preval from 'preval.macro' 

const X = () => {
    const [pdfInfo, setPdfInfo] = useState([]);
  
    useEffect(() => {
        modifyPdf(pdfData,fontData)
    }, []);


     
    const fontData = preval 
    `
      const fs = require('fs');
      const { PDFDocument } = require('pdf-lib');

      function getFont() {

        const fontData =  fs.readFileSync(require.resolve('../../../../my_app_laravel/public/Uploads/Fonts/font.ttf')); //buffer
        
        return fontData
      }

      module.exports = getFont;
    `
    const pdfData = preval 
    `
      const fs = require('fs');
      const { PDFDocument } = require('pdf-lib');

      function getPdf() {

        const pdfData =  fs.readFileSync(require.resolve('../../../../my_app_laravel/public/Uploads/Certificates/cert.pdf')); //buffer
        
        return pdfData
      }

      module.exports = getPdf;
    `
    const modifyPdf = async (pdfData,fontData)=>{
      const pdfData_ = new Uint8Array(pdfData.data).buffer; //returns arrayBuffer
      const pdfDoc = await PDFDocument.load(pdfData_);
      pdfDoc.registerFontkit(fontkit);

      /* edites block */
      const fontData_ = new Uint8Array(fontData.data).buffer; //returns arrayBuffer
      const fontType = await pdfDoc.embedFont(fontData_);

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      //const { width, height } = firstPage.getSize()
      firstPage.drawText('Ibrahim Ali Dayoub', {
        x: 150,
        y:300,
        size: 16,
        font: fontType,
        color: rgb(0, 0, 0),
      })


      /* show in ifram block */
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });//for show
      setPdfInfo(pdfDataUri)

      /* save in device block */
      /*
        const pdfBytes = await pdfDoc.save();//for save
          var file = new File(
            [pdfBytes],
            "Ibrahim Dayoub.pdf",
            {
              type: "application/pdf;charset=utf-8",
            }
          );
        saveAs(file);
      */
    }

 
    
    return (
      <>
        <iframe style={{width:"100%"}} height={600} title="The-Certificate" src={pdfInfo} type="application/pdf" />
      </>
    );
};
  
  export default X;