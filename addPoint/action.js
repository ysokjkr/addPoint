'use strict';
const cron = require('node-cron');
const point = require('./point');
const mail = require('./mail');

cron.schedule('00 00 8 1 *', () => {
	point.addPoint().then(pointInfo => {
		mail.sendMail(pointInfo);
	});
});