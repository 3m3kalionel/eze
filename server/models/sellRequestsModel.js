import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import extendSchema from 'mongoose-extend-schema';

import requestSchema from './requestSchema';

// import { isEmpty } from "../utils.js";

const sellRequestSchema = extendSchema(requestSchema, {
	requestType: {
		type: String,
	},
});

sellRequestSchema.plugin(beautifyUnique);
sellRequestSchema.index({ '$**': 'text' });

export default mongoose.model('sellRequests', sellRequestSchema);
