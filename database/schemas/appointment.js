import mongoose from 'mongoose'

const AppointmentSchema = mongoose.Schema(
	{
		patient: {
			id: {
				type: String,
				default: ''
			}
		},
		services: {
			type: String,
			default: ''
		},
		schedule: {
			id: {
				type: String,
				default: ''
			}
		},
		time: {
			type: String,
			default: ''
		},
		amount: {
			type: Number,
			default: 200
		},
		method: {
			type: String,
			default: 'GCash'
		},
		proof: {
			type: String,
			default: ''
		},
		status: {
			type: Boolean,
			default: false
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

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema)

export default Appointment
