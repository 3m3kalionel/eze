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

const searchProducts = async (req, res) => {
	const pipeline = [
		{
			'$lookup': {
				'from': 'buyrequests',
				'pipeline': [
					{
						'$match': {
							'$text': {
								'$search': '\"iPhone6\"'
							},
						}
					}
				],
				'as': 'buys'
			}
		}, {
			'$lookup': {
				'from': 'sellrequests',
				'pipeline': [
					{
						'$match': {
							'$text': {
								'$search': 'C/D'
							}
						}
					}
				],
				'as': 'sells'
			}
		}, {
			'$limit': 1
		}, {
			'$project': {
				'buys': 1,
				'sells': 1,
				'_id': 0
			}
		}, {
			'$addFields': {
				'match': {
					'$concatArrays': [
						'$buys', '$sells'
					]
				}
			}
		}, {
			'$project': {
				'match': 1
			}
		}, {
			'$unwind': {
				'path': '$match',
				'preserveNullAndEmptyArrays': true
			}
		},
		{ '$sort': { "match.price": 1 } },
		{ '$skip': 0 },
		{
			'$limit': 20
		}
	]
	const results = await buyRequestModel.aggregate(
		pipeline
	);

	res.status(200).json({
		message: 'status: ok',
		results,
	});
}

export default {
	saveSheetsDataToCollections,
	searchProducts
};
