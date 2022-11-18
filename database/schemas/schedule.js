import mongoose from 'mongoose'

const ScheduleSchema = mongoose.Schema(
	{
		date: {
			type: String,
			default: ''
		},
		patients: {
			type: Array,
			default: []
		},
		maximum: {
			type: Number,
			default: 0
		},
		status: {
			type: Boolean,
			default: true
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

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema)

export default Schedule
