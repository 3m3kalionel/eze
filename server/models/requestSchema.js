import mongoose from 'mongoose';
import { isEmpty } from '../utils';

const requestSchema = mongoose.Schema({
	model: {
		type: String,
		required: [
			true,
			'status: failed - Please enter the request[iPhone] model',
		],
		validate: {
			validator(field) {
				return isEmpty(field);
			},
			message: () => 'status: failed - Please enter the request[iPhone] model',
		},
	},
	status: {
		type: 'String',
	},
	storageSize: {
		type: String,
		enum: {
			values: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB'],
			message: 'status: failed - {VALUE} not supported. storage size can only be one of 16GB, 32GB, 64GB, 128GB 256GB or 512GB',
		},
	},
	condition: {
		type: String,
		enum: {
			values: ['New', 'A1', 'A2', 'B1', 'B2', 'C', 'C/B', 'C/D'],
			message: 'status: failed - {VALUE} not supported. condition can only be one of: New, A1, A2, B1, B2, C, C/B or C/D',
		},
	},
	price: {
		type: String,
		required: [true, "status: failed - Please enter the phone's price"],
		validate: {
			validator(field) {
				return isEmpty(field);
			},
			message: () => "status: failed - Please enter the phone's price",
		},
	},
},
	{ timestamps: true }
);

export default requestSchema;
