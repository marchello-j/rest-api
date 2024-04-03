import nodemailer from 'nodemailer'
import { envSetting } from '../envSetting'

export const emailAdapter = {
	async sendEmail(login: string, password: string, email: string) {
		let transport = nodemailer.createTransport({
			host: 'smtp.mail.ru',
			port: 465,
			auth: {
				user: envSetting.EMAIL_SENDER,
				pass: envSetting.EMAIL_PASSWORD
			}
		})
		const info = await transport.sendMail({
			from: '"Anamary 👻" <marchello.marsel@mail.ru>', // sender address
			to: email,
			subject: login, // Subject line
			html: password // plain text body
		})
		console.log(info)
		return info
	}
}
