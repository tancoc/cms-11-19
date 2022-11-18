import mongoose from 'mongoose'

const AccountSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	}
})

const Accounts = mongoose.models.Accounts || mongoose.model('Accounts', AccountSchema)

export default Accounts
