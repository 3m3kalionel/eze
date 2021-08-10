import fs from 'fs';

import buyRequestModel from '../models/buyRequestsModel';
import sellRequestModel from '../models/sellRequestsModel';

import { authorize, getSheetsRequestsData } from '../utils';

const saveSheetsDataToCollections = async (req, res) => {
	try {
		const response = await fs.readFileSync(
			'/Users/emeka/Desktop/code/eze/server/oauthCredentials.json'
		);

		const oAuthClient = await authorize(JSON.parse(response));
		const sheetsRequestDataResponse = await getSheetsRequestsData(oAuthClient);
		const { buyRequestsObject, sellRequestsObject } = sheetsRequestDataResponse;

		const buyRequestsObjectHeaders = buyRequestsObject.headers[0];
		const sellRequestsObjectHeaders = sellRequestsObject.headers[0];
		delete buyRequestsObject.headers;
		delete sellRequestsObject.headers;

		const buyRequestsCollection = [];
		const sellRequestsCollection = [];
		const buyRequestsPhoneModels = Object.keys(buyRequestsObject);
		const sellRequestsPhoneModels = Object.keys(sellRequestsObject);

		function getBaseData(requestType) {
			if (requestType === 'buy') {
				return { requestType: 'Buy Request', status: 'unlocked' };
			}
			return { requestType: 'Sell Request', status: 'unlocked' };
		}

		function createRequestCollection(requestDetails, phoneDetails, model) {
			for (let i = 1; i < requestDetails.headers.length; i += 1) {
				const collectionDetails = getBaseData(requestDetails.requestType);

				collectionDetails.condition = requestDetails.headers[i];
				collectionDetails.storageSize = phoneDetails[0];
				collectionDetails.model = model;
				collectionDetails.price = phoneDetails[i];

				if (requestDetails.requestType === 'buy') {
					buyRequestsCollection.push(collectionDetails);
				} else {
					sellRequestsCollection.push(collectionDetails);
				}
			}
		}

		buyRequestsPhoneModels.forEach((model) => {
			for (const modelData of buyRequestsObject[model]) {
				createRequestCollection(
					{
						headers: buyRequestsObjectHeaders,
						requestType: 'buy',
					},
					modelData,
					model
				);
			}
		});

		sellRequestsPhoneModels.forEach((model) => {
			for (const modelData of sellRequestsObject[model]) {
				createRequestCollection(
					{
						headers: sellRequestsObjectHeaders,
						requestType: 'sell',
					},
					modelData,
					model
				);
			}
		});

		try {
			await buyRequestModel.insertMany(buyRequestsCollection, (err, docs) => {
				if (err) {
					console.log(err);
				}
			});

			await sellRequestModel.insertMany(sellRequestsCollection, (err, docs) => {
				if (err) {
					console.log(err);
				}
			});
			return res.status(200).send({
				message: 'success',
			});
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
};

export default {
	saveSheetsDataToCollections,
};
