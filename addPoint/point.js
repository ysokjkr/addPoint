'use strict';
const puppeteer = require('puppeteer');
const INTERNET_URL = 'https://my.unext.co.jp/Login';
const UNEXT_GIFT_URL = 'https://video.unext.jp/login?backurl=https://video.unext.jp/giftcode/input';
const UNEXT_ACCOUNT_URL = 'https://video.unext.jp/myaccount';

// U-NEXT通信サービスの認証情報(https://my.unext.co.jp/Login)
const INTERNET_ID = 'id';
const INTERNET_PASS = 'password';
// U-NEXTの認証情報(https://video.unext.jp/login)
const UNEXT_ID = 'id';
const UNEXT_PASS = 'password'; 

// ポイントを反映させて、現状のポイント情報を返す。
const addPoint = async() => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.goto(INTERNET_URL);
	await page.type('input#login_id', INTERNET_ID);
	await page.type('input#password', INTERNET_PASS);
	await page.click('.btn-login');

	await page.waitForSelector('footer');
	const giftText = await page.evaluate(() => {
		// 他にやり方があるのか？？
	    return document.querySelectorAll('td')[8].innerHTML;
	  });

	const giftCode = giftText.match(/ギフトコード：([0-9a-zA-Z]+)/)[1];

	if (!giftCode) {
		return 'GiftCodeの取得に失敗しました。';
	}

	console.log(`GitCode: ${giftCode}`);

	await page.goto(UNEXT_GIFT_URL);

	// login
	await page.type('input.js-acc-login__id', UNEXT_ID);
	await page.type('input.js-acc-login__pass', UNEXT_PASS);
	await page.click('.js-acc-login-btn--submit');

	// set GifCode
	await page.waitForSelector('.js-acc-giftcode');
	await page.type('input.js-acc-giftcode', giftCode);
	await page.click('.js-acc-btn--submit');

	// submit
	await page.waitForSelector('.js-acc-btn--submit');
	await page.click('.js-acc-btn--submit');

	// pointInfo
	await page.goto(UNEXT_ACCOUNT_URL);

	await page.waitForSelector('.ui-attention-panel');
	const pointInfo = await page.evaluate(() => {
		return document.querySelector('.ui-attention-panel').childNodes[1].innerText;
	});
	console.log(`PointInfo: ${pointInfo}`);

	await browser.close();

	return pointInfo;
};

exports.addPoint = addPoint; 