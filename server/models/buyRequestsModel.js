import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import extendSchema from 'mongoose-extend-schema';

import requestSchema from './requestSchema';

const buyRequestSchema = extendSchema(requestSchema, {
	requestType: {
		type: String,
	},
});

buyRequestSchema.plugin(beautifyUnique);
buyRequestSchema.index({ '$**': 'text' });

export default mongoose.model('buyRequests', buyRequestSchema);
