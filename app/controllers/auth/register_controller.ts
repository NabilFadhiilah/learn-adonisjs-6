import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])

    const validateData = await registerValidator.validate(data)
    const user = await User.create(validateData)

    return response.redirect().toRoute('home')
  }
}
