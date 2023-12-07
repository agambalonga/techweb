const { Router }  = require('express');
const Artist = require('../model/Artist');
const Event = require('../model/Event');
const User = require('../model/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper to move to next line
function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }

module.exports.get_ticket = async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findOne({ 'events_booked._id': id });

    const event_booked = user.events_booked.find(event => event._id == id);
    const event = await Event.findOne({_id: event_booked.event_id});




    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      });
    
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
    doc.fontSize(10);

    // Margin
    const distanceMargin = 18;

    doc
    .fillAndStroke('#0e8cc3')
    .lineWidth(20)
    .lineJoin('round')
    .rect(
        distanceMargin,
        distanceMargin,
        doc.page.width - distanceMargin * 2,
        doc.page.height - distanceMargin * 2,
    )
    .stroke();

    // Header
    const maxWidth = 140;
    const maxHeight = 70;

    doc.image('public/'+event.image_URL, doc.page.width / 2 - maxWidth / 2, 60, {
        fit: [maxWidth, maxHeight],
        align: 'center',
      });

    jumpLine(doc, 5);


    doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Super Course for Awesomes', {
    align: 'center',
  });

jumpLine(doc, 2)

// Content
doc
  .font('public/fonts/NotoSansJP-Regular.otf')
  .fontSize(16)
  .fill('#021c27')
  .text('CERTIFICATE OF COMPLETION', {
    align: 'center',
  });

jumpLine(doc, 1)

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Present to', {
    align: 'center',
  });

jumpLine(doc, 2)

doc
  .font('public/fonts/NotoSansJP-Bold.otf')
  .fontSize(24)
  .fill('#021c27')
  .text('STUDENT NAME', {
    align: 'center',
  });

jumpLine(doc, 1)

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Successfully completed the Super Course for Awesomes.', {
    align: 'center',
  });

jumpLine(doc, 7)

doc.lineWidth(1);

// Signatures
const lineSize = 174;
const signatureHeight = 390;

doc.fillAndStroke('#021c27');
doc.strokeOpacity(0.2);

const startLine1 = 128;
const endLine1 = 128 + lineSize;
doc
  .moveTo(startLine1, signatureHeight)
  .lineTo(endLine1, signatureHeight)
  .stroke();

const startLine2 = endLine1 + 32;
const endLine2 = startLine2 + lineSize;
doc
  .moveTo(startLine2, signatureHeight)
  .lineTo(endLine2, signatureHeight)
  .stroke();

const startLine3 = endLine2 + 32;
const endLine3 = startLine3 + lineSize;
doc
  .moveTo(startLine3, signatureHeight)
  .lineTo(endLine3, signatureHeight)
  .stroke();

doc
  .font('public/fonts/NotoSansJP-Bold.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('John Doe', startLine1, signatureHeight + 10, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Associate Professor', startLine1, signatureHeight + 25, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

doc
  .font('public/fonts/NotoSansJP-Bold.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Student Name', startLine2, signatureHeight + 10, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Student', startLine2, signatureHeight + 25, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

doc
  .font('public/fonts/NotoSansJP-Bold.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Jane Doe', startLine3, signatureHeight + 10, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text('Director', startLine3, signatureHeight + 25, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: 'center',
  });

jumpLine(doc, 4);

// Validation link
const link =
  'https://validate-your-certificate.hello/validation-code-here';

const linkWidth = doc.widthOfString(link);
const linkHeight = doc.currentLineHeight();

doc
  .underline(
    doc.page.width / 2 - linkWidth / 2,
    448,
    linkWidth,
    linkHeight,
    { color: '#021c27' },
  )
  .link(
    doc.page.width / 2 - linkWidth / 2,
    448,
    linkWidth,
    linkHeight,
    link,
  );

doc
  .font('public/fonts/NotoSansJP-Light.otf')
  .fontSize(10)
  .fill('#021c27')
  .text(
    link,
    doc.page.width / 2 - linkWidth / 2,
    448,
    linkWidth,
    linkHeight
  );

// Footer
const bottomHeight = doc.page.height - 100;

doc.image('public/images/qr.png', doc.page.width / 2 - 30, bottomHeight, {
  fit: [60, 60],
});









/*

    // Header del PDF
    doc.font('Helvetica-Bold').fontSize(24).text('EVENT BOOKING', { align: 'center' });
    doc.moveDown();
    //doc.image(event.image_URL, { align: 'center', width: 200 });
    doc.moveDown();

    // Informazioni sul biglietto
    doc.font('Helvetica').fontSize(12).text(`Name: ${event.title}`, { align: 'left' });
    doc.text(`Date: ${event.date}`, { align: 'left' });
    doc.text(`Luogo: ${event.city}-${event.site}`, { align: 'left' });
    // Codice a barre (sostituiscilo con il tuo vero codice a barre)
    doc.rect(400, 50, 150, 70).fill('#fff').stroke();
    doc.fontSize(14).fillColor('#000').text('Codice a Barre', 425, 70);
    doc.moveDown();

    // Footer del PDF
    doc.fontSize(10).text('Grazie per aver prenotato!', { align: 'center' });

    */

    
    // Invio del PDF come risposta
    res.setHeader('Content-Disposition', `attachment; filename="ticket_${id}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.end();
};




