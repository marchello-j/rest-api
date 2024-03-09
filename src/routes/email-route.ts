import { Request, Response, Router } from 'express'
import nodemailer from 'nodemailer'

export const emailRoute = Router({})

emailRoute.post('/send', async (req: Request, res: Response) => {
	let transport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'anamaryraik@gmail.com',
			pass: 'SuperDeveloper2024'
		}
	})

	const info = await transport.sendMail({
		from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
		to: 'bar@example.com, baz@example.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>' // html body
	})

	res.send({
		email: req.body.email,
		message: req.body.message,
		subject: req.body.subject
	})
})
