import sgMail from '@sendgrid/mail'
import Appointment from 'database/schemas/appointment'
import Users from 'database/schemas/users'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	const { id } = req.body

	const appointment = await Appointment.findById({ _id: id })
	console.log(appointment)

	const user = await Users.findById({ _id: appointment.patient.id })
	console.log(user)

	const msg = {
		to: user.email,
		from: process.env.EMAIL_FROM,
		subject: 'We have rejected your partial payment!',
		html: `<p>we have rejected your partial payment due to insufficient amount of moneu you sent. Your money will be refunded to your Gcash account right away.<br /><br />Note: Please send an amount of exact partial payment to your next transaction.<br/><br/><b>Dr.Jevemille Pascual - Camillon Dental Clinic.</b></p>`
	}

	sgMail
		.send(msg)
		.then(() => {
			res.status(200).send('request success.')
		})
		.catch((error) => {
			res.status(400).send('request failed.')
		})
}
