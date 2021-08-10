import { google } from "googleapis";
import readline from "readline";
import fs from "fs";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = "token.json";

export const isEmpty = fieldValue => !(fieldValue.trim().length === 0);

export const getNewToken = (oAuth2Client, callback) => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});

	console.log("Authorize this app by visiting this url:", authUrl);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question("Enter the code from that page here: ", code => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) {
				return console.error(
					"Error while trying to retrieve access token",
					err
				);
			}
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions

			fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
				if (err) return console.error(err);
				console.log("Token stored to", TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
};

export const getSheetsRequestsData = async auth => {
	const sheets = await google.sheets({ version: "v4", auth });
	const googleSheetsResponse = await sheets.spreadsheets.values.batchGet({
		spreadsheetId: "1F6BvjBRKMf6cVTzrb3O-4uORjnhHN0I6DC9jkuxQibo",

		ranges: [
			[
				"IPHONES!B4:J4",
				"IPHONES!B5:J7",
				"IPHONES!B10:J12",
				"IPHONES!B15:J17",
				"IPHONES!B20:J21",
				"IPHONES!B24:J25",
				"IPHONES!B28:J29",
				"IPHONES!B32:J34",
				"IPHONES!B37:J39",
				"IPHONES!B42:J45",
				"IPHONES!B48:J51",
				"IPHONES!B54:J56",
				"IPHONES!B59:J61",
				"IPHONES!B64:J66",
			],
			[
				"IPHONES!M4:U4",
				"IPHONES!M5:U7",
				"IPHONES!M10:U12",
				"IPHONES!M15:U17",
				"IPHONES!M20:U21",
				"IPHONES!M24:U25",
				"IPHONES!M28:U29",
				"IPHONES!M32:U34",
				"IPHONES!M37:U39",
				"IPHONES!M42:U45",
				"IPHONES!M48:U51",
				"IPHONES!M54:U56",
				"IPHONES!M59:U61",
				"IPHONES!M64:U66",
			],
		],

		majorDimension: "ROWS",
		valueRenderOption: "FORMATTED_VALUE",
		dateTimeRenderOption: "FORMATTED_STRING",
	});

	const googleSheetsTablesData = googleSheetsResponse.data.valueRanges;

	if (!googleSheetsTablesData.length) {
		console.log("no data returned");
	}

	const arrayMidpoint = googleSheetsTablesData.length / 2;

	const googleSheetsBuyRequests = googleSheetsTablesData.slice(
		0,
		arrayMidpoint
	);

	const googleSheetsSellRequests = googleSheetsTablesData.slice(
		arrayMidpoint,
		googleSheetsResponse.length
	);

	const buyRequests = [];
	const sellRequests = [];

	googleSheetsBuyRequests.forEach(obj => buyRequests.push(obj.values));
	googleSheetsSellRequests.forEach(obj => sellRequests.push(obj.values));

	var [
		headers,
		iPhoneXsMax,
		iPhoneXs,
		iPhoneXr,
		iPhoneX,
		iPhone8Plus,
		iPhone8,
		iPhone7Plus,
		iPhone7,
		iPhone6SPlus,
		iPhone6S,
		iPhone6Plus,
		iPhone6,
		iPhoneSE,
	] = buyRequests;

	const buyRequestsObject = {
		headers,
		iPhoneXsMax,
		iPhoneXs,
		iPhoneXr,
		iPhoneX,
		iPhone8Plus,
		iPhone8,
		iPhone7Plus,
		iPhone7,
		iPhone6SPlus,
		iPhone6S,
		iPhone6Plus,
		iPhone6,
		iPhoneSE,
	};

	var [
		headers,
		iPhoneXsMax,
		iPhoneXs,
		iPhoneXr,
		iPhoneX,
		iPhone8Plus,
		iPhone8,
		iPhone7Plus,
		iPhone7,
		iPhone6SPlus,
		iPhone6S,
		iPhone6Plus,
		iPhone6,
		iPhoneSE,
	] = sellRequests;

	const sellRequestsObject = {
		headers,
		iPhoneXsMax,
		iPhoneXs,
		iPhoneXr,
		iPhoneX,
		iPhone8Plus,
		iPhone8,
		iPhone7Plus,
		iPhone7,
		iPhone6SPlus,
		iPhone6S,
		iPhone6Plus,
		iPhone6,
		iPhoneSE,
	};

	return {
		buyRequestsObject,
		sellRequestsObject,
	};
};

export const authorize = async (credentials, callback) => {
	const { client_secret, client_id, redirect_uris } = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	);

	try {
		const authResponse = await fs.readFileSync(TOKEN_PATH);
		oAuth2Client.setCredentials(JSON.parse(authResponse));
		return oAuth2Client;
	} catch (err) {
		return getNewToken(oAuth2Client, callback, SCOPES);
	}
};
