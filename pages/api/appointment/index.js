import connect from 'database/connect'
import sgMail from '@sendgrid/mail'
import Users from 'database/schemas/users'
import Appointment from 'database/schemas/appointment'
import Schedule from 'database/schemas/schedule'
import Services from 'database/schemas/services'

export default async (req, res) => {
	const { method } = req
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Appointment.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body

				await Appointment.create({
					patient: {
						id: data.userId
					},
					services: data.services,
					schedule: {
						id: data.scheduleId
					},
					proof: data.proof,
					created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				})

				await Users.findByIdAndUpdate(
					{ _id: data.userId },
					{
						name: data.name,
						age: data.age,
						gender: data.gender,
						contact: data.contact,
						address: data.address,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				const schedule = await Schedule.findById({ _id: data.scheduleId })

				schedule.patients.push(data.userId)
				await schedule.save()

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				const { id, data } = req.body
				console.log(req.body)

				const appointment = await Appointment.findById(id)

				console.log(appointment)

				const user = await Users.findById(appointment.patient.id)

				console.log(user)

				const schedule = await Schedule.findById(appointment.schedule.id)

				console.log(schedule)

				const service = await Services.findById({ _id: appointment.services })

				let number = 0

				schedule.patients.map((patient, index) => {
					if (patient === user._id.toString()) {
						number = index
					}
				})

				const msg = {
					to: user.email,
					from: process.env.EMAIL_FROM,
					subject: 'We have received your patial payment successfully.',
					html: `<p>Dear Valued Customer,<br /><br />We have received your partial payment successfully through Gcash. Webform with the following details:<br /><br />Date filed: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}<br /><br />Patient Number: ${number}<br /><br />Date Schedule: ${schedule.date}<br /><br />Time of Schedule: ${data.time}<br /><br />Service: ${service.name}<br /><br />Amount of Service: ${service.price} Pesos<br/><br /><b>Dr.Jevemille Pascual - Camilon Dental Clinic</b></p>`
				}

				await sgMail.send(msg)

				await Appointment.findByIdAndUpdate(
					{ _id: id },
					{
						...data,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		default:
			res.status(400).send('request failed.')
			break
	}
}
