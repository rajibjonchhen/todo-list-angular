import nodemailer from 'nodemailer'

export const sendConfirmationEmail = function ({toUser, hash}) {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASSWORD
            }
        })
        const message = {
            from: process.env.GOOGLE_USER,
            to: toUser.email,
            subject: 'Book Finder V2 - Confirm your account',
            html: `<p>Hello ${toUser.firstName},</p>
                <p>Please confirm your account by clicking the link below:</p>
                <a href="${process.env.VUE_APP_BASE_URL}/confirmation/${hash}" style='background-color:"gold",color:"white", padding:"3px", border-radius:"5px"'>Confirm</a>
                <p>Thank you!</p>
                <p>Book Finder Team</p>
                `

        }
        transporter.sendMail(message, (err, info) => {
            if (err) rej(err)
            else res(info)
        })
    })
}
