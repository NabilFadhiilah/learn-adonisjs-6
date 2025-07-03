import Movie from '#models/movie'
import MovieStatus from '#models/movie_statues'
import { MovieService } from '#services/movie_service'
import { movieFilterValidator } from '#validators/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async index({ request, view }: HttpContext) {
    const filters = await movieFilterValidator.validate(request.qs())

    const movies = await MovieService.getFiltered(filters)

    const movieStatuses = await MovieStatus.query().orderBy('name').select('id','name')

    const movieSortOptions = MovieService.sortOptions

    return view.render('pages/movies/index', {
      movies,
      movieStatuses,
      movieSortOptions,
      filters,
    })
  }

  async show({ view, params }: HttpContext) {
    const movie = await Movie.findByOrFail('slug',params.slug)
    const cast = await movie.related('castMembers').query()
      .orderBy('pivot_sort_order','asc')
    const crew = await movie.related('crewMembers').query()
      .pivotColumns(['title','sort_order'])
      .orderBy('pivot_sort_order','asc')
    await movie.load('director')
    await movie.load('writer')
    return view.render('pages/movies/show', { movie, cast, crew})
  }
}
