require('dotenv').config()
const sendgrid = require('@sendgrid/mail')
const Mailgen = require('mailgen')

class EmailService {
  #sender = sendgrid
  #GenerateTemplate = Mailgen
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = 'link for production'
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
  }
  createVerifyEmailTemplate(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'hw05',
        link: this.link,
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
      },
    })
    const email = {
      body: {
        name,
        intro: "Welcome to hw06! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with hw06, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    }
    const emailBody = mailGenerator.generate(email)
    return emailBody
  }
  async sendVerifyEmail(email, name, verifyToken) {
    try {
      this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
        to: email,
        from: 'c.gaze145@gmail.com', // Change to your verified sender
        subject: 'Verify email',
        html: this.createVerifyEmailTemplate(verifyToken, name),
      }

      await this.#sender.send(msg)
    } catch (error) {
      console.log('error:', error.response.body)
    }
  }
}

module.exports = EmailService
