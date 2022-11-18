import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			required: true
		},
		image: {
			type: String,
			default: ''
		},
		age: {
			type: String,
			default: ''
		},
		gender: {
			type: String,
			default: ''
		},
		contact: {
			type: String,
			default: ''
		},
		address: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			default: 'Patient'
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

const Users = mongoose.models.Users || mongoose.model('Users', UserSchema)

export default Users
