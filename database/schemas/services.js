import mongoose from 'mongoose'

const ServicesSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		price: {
			type: Number,
			default: 0
		},
		created: {
			type: String,
			default: ''
		},
		updated: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

const Services = mongoose.models.Services || mongoose.model('Services', ServicesSchema)

export default Services
