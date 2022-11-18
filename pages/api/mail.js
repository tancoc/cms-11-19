import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	const { data } = req.body

	const msg = {
		to: process.env.EMAIL_FROM,
		from: process.env.EMAIL_FROM,
		subject: data.email,
		text: data.message
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
