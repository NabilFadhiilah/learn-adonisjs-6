import Cineast from "#models/cineast";
import Movie from "#models/movie";
import MovieStatus from "#models/movie_statues";
import User from "#models/user";
import { movieValidator } from "#validators/movie";
import { movieFilterValidator } from "#validators/movie_filter";
import { MultipartFile } from "@adonisjs/core/bodyparser";
import { cuid } from "@adonisjs/core/helpers";
import app from "@adonisjs/core/services/app";

import { Infer } from "@vinejs/vine/types";

type MovieSortoption = {
  id: string,
  text: string,
  field: string,
  dir: 'asc'|'desc'|undefined
}

export class MovieService {
  static sortOptions:MovieSortoption[]=[{
      id:'title_asc',
      text: 'Title (asc)',
      field: 'title',
      dir:'asc'
    },{
      id:'title_desc',
      text: 'Title (desc)',
      field: 'title',
      dir:'desc'
    },{
      id: 'releasedAt_asc',
      text: 'Release Date (asc)',
      field: 'releasedAt',
      dir: 'asc'
    },{
      id: 'releasedAt_desc',
      text: 'Release Date (desc)',
      field: 'releasedAt',
      dir: 'desc'
    },{
      id: 'writer_asc',
      text: 'Writer Name (asc)',
      field: 'cineasts.last_name',
      dir: 'asc'
    },{
      id: 'writer_desc',
      text: 'Writer Name (desc)',
      field: 'cineasts.last_name',
      dir: 'desc'
    },

  ]
  static getFiltered(
    filters:Infer<typeof movieFilterValidator>,
    user:User | undefined = undefined
  ){
    const sort = this.sortOptions.find((option)=>option.id === filters.sort)||this.sortOptions[0]

    return Movie.query()
      .if(filters.search, (query) => query.whereILike('title', `%${filters.search}%`))
      .if(filters.status, (query)=>query.where('statusId',filters.status!))
      .if(['writer_asc', 'writer_desc'].includes(sort.id), (query) => {
        query.join('cineasts', 'cineasts.id', 'writer_id').select('movies.*')
      })
      .if(user,
        (query)=>query.preload('watchlist',
          (watchlist)=>watchlist.where('userId',user!.id)
      ))
      .preload('director')
      .preload('writer')
      .preload('status')
      .orderBy(sort.field, sort.dir)
      .select('movies.*')
  }

  static async getFormData(){
      const statuses = await MovieStatus.query().orderBy('name')
      const cineasts = await Cineast.query().orderBy('lastName')
      return {statuses,cineasts}
  }

  static async storePoster(poster:MultipartFile){
    const fileName = `${cuid()}.${poster.extname}`
      await poster.move(app.makePath('storage/posters'),{
        name: fileName
      })
      return `/storage/posters/${fileName}`
  }

  static async snycCastAndCrew(
    movie: Movie,
    cast:Infer<typeof movieValidator>['cast'],
    crew:Infer<typeof movieValidator>['crew']
  ){
    const crewMembers = crew?.reduce<Record<number, { title: string; sort_order: number }>>(
      (acc, row, index) => {
        acc[row.id] = { title: row.title, sort_order: index }
        return acc
      },
      {}
    )

    const castMembers = cast?.reduce<Record<number, { character_name: string; sort_order: number }>>(
      (acc, row, index) => {
        acc[row.id] = { character_name: row.character_name, sort_order: index }
        return acc
      },
      {}
    )

    await movie.related('crewMembers').sync(crewMembers ?? [])
    await movie.related('castMembers').sync(castMembers ?? [])
  }
}
