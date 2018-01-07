'use strict';
const nodemailer = require("nodemailer");

// Gmailのアカウント
const USER = "id";
const PASS = "password";
const TO_ADDRESS = 'mailAddress';

const smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // SSL
	auth: {
		user: USER,
		pass: PASS
	}
};

const sendMail = (pointText) => {
	this.transporter = nodemailer.createTransport(smtpConfig);
	//メール情報の作成
	const mailText = 
	`今月分のギフトコードの反映処理を実行しました。現在のポイント情報をお知らせします。\n\n${pointText}\n\nシネマクーポンへの引き換えは以下URLから可能です。\nhttps://video.unext.jp/movieticket`;

	const message = {
		from: USER,
		to: TO_ADDRESS,
		subject: '今月のU-NEXTポイント情報',
		text: mailText
	}

	// メール送信
	try {
		this.transporter.sendMail(message, function(error, info) {
			if(error){
				console.log("send failed");
				console.log(error.message);
				return;
			}
			console.log("send successful");
			console.log(info.messageId);
		});
	} catch(e) {
		console.log("Error",e);
	}
}

exports.sendMail = sendMail;
