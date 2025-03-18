import fs from 'fs';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import { type NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(req: NextRequest) {
  console.log(req.body);
  try {
    const pdfPath = path.join(process.cwd(), 'public/pedimento_format.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontPath = path.join(
      process.cwd(),
      'public/fonts/NotoEmoji-Bold.ttf'
    );
    const pages = pdfDoc.getPages();
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }
    const { height } = page.getSize();

    const colors = {
      CHECKED: rgb(0.322, 0.682, 0.224),
      WARNING: rgb(0.922, 0.792, 0.384),
      ERROR: rgb(0.816, 0.255, 0.239),
    };

    //   CHECKED
    page.drawRectangle({
      x: 101,
      y: height - 93,
      width: 41,
      height: 8,
      opacity: 0.2,
      borderWidth: 0.5,
      color: colors['CHECKED'],
      borderColor: colors['CHECKED'],
    });

    //   WARNING
    page.drawText('⚠️', {
      x: 90,
      y: height - 100,
      size: 6,
      font: customFont,
      color: colors['WARNING'],
    });
    page.drawRectangle({
      x: 101,
      y: height - 101.5,
      width: 21,
      height: 8,
      opacity: 0.2,
      borderWidth: 0.5,
      color: colors['WARNING'],
      borderColor: colors['WARNING'],
    });

    //   ERROR
    page.drawText('❌', {
      x: 90,
      y: height - 117.5,
      size: 6,
      font: customFont,
      color: colors['ERROR'],
    });
    page.drawRectangle({
      x: 101,
      y: height - 119,
      width: 41,
      height: 8,
      opacity: 0.2,
      borderWidth: 0.5,
      color: colors['ERROR'],
      borderColor: colors['ERROR'],
    });

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(
      process.cwd(),
      'public',
      'pedimento_format_modified.pdf'
    );
    fs.writeFileSync(outputPath, pdfBytes);

    return new NextResponse('PDF modified', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
