const { Router }  = require('express');
const Artist = require('../model/Artist');
const Event = require('../model/Event');
const User = require('../model/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const puppeteer = require('puppeteer');


module.exports.get_ticket = async (req, res) => {
    const { id } = req.params;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/ticket/'+id+'/pdf', {waitUntil: 'networkidle2'});

    const timestamp = new Date().getTime();
    const screenshotBuffer = await page.screenshot({ path: 'public/screenshot_'+timestamp+'.png' });

    let pdfDocument = new PDFDocument();

    pdfDocument.image(screenshotBuffer, 0, 0, {fit: [595, 842]});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="output.pdf"');

    pdfDocument.pipe(res);
    pdfDocument.end();

    //elimina il file screenshot.png
    fs.unlinkSync('public/screenshot_'+timestamp+'.png');

    await browser.close();
};


module.exports.get_ticketPdf = async (req, res) => {

    const { id } = req.params;
    
    const user = await User.findOne({ 'events_booked._id': id });

    const event_booked = user.events_booked.find(event => event._id == id);
    const event = await Event.findOne({_id: event_booked.event_id});

    var data = {
        title: event.title,
        artist: event.artist.name,
        city: event.city,
        site: event.site,
        qty: event_booked.qty,
        ticket_id: event_booked._id

    };

    var date = new Date(event.date);

    var day = date.getDate();
    var month = getMonthByNumber(date.getMonth());
    var year = date.getFullYear();
    var hour = date.getHours();

    data.month = month;
    data.year = year;
    data.hour = hour;

    if(day<10) {
        data.day = '0'+day;
    } else {
        data.day = day;
    }

    if(hour < 12) {
        data.ampm = 'AM';
    } else {
        data.ampm = 'PM';
    }

    res.render('ticket', {data});

};


function getMonthByNumber(month) {
    switch (month) {
        case 0:
            return 'JAN';
        case 1:
            return 'FEB';
        case 2:
            return 'MAR';
        case 3:
            return 'APR';
        case 4:
            return 'MAY';
        case 5:
            return 'JUN';
        case 6:
            return 'JUL';
        case 7:
            return 'AUG';
        case 8:
            return 'SEP';
        case 9:
            return 'OCT';
        case 10:
            return 'NOV';
        case 11:
            return 'DEC';
        default:
            return 'JAN';
    }
}
