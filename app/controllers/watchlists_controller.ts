import Watchlist from '#models/watchlist'
import type { HttpContext } from '@adonisjs/core/http'

export default class WatchlistsController {

  async index({}: HttpContext) {}

  async toggle({response, params, auth}: HttpContext) {
    const {movieId}=params
    const userId = auth.user!.id
    const watchlist = await auth.user!.related('watchlist').query().where({movieId}).first()

    if(watchlist){
      await watchlist.delete()
    }else{
      await Watchlist.create({movieId,userId})
    }

    return response.redirect().back()
  }

  async toggleWatched({}: HttpContext) {}

}
