import Movie from "#models/movie";
type MovieSortoption = {
  id: string,
  text: string,
  field: keyof Movie,
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
    },

  ]
  static getFiltered(filters:Record<string,any>){
    const sort = this.sortOptions.find((option)=>option.id === filters.sort)||this.sortOptions[0]

    return Movie.query()
      .if(filters.search, (query) => query.whereILike('title', `%${filters.search}%`))
      .if(filters.status, (query)=>query.where('statusId',filters.status))
      .preload('director')
      .preload('writer')
      .preload('status')
      .orderBy(sort.field, sort.dir)
      .limit(15)
  }
}
