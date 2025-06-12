/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs/promises'

router.on('/').render('pages/home').as('home')

// linking route
router.get('/movies/:slug', async (ctx) => {
  // ctx.view.share({movie:'my awsome movie'})
  const url = app.makeURL(`resources/movies/${ctx.params.slug}.html`)
  const movie = await fs.readFile(url, 'utf8')
  return ctx.view.render('pages/movies/show',{movie})
}).as('movies.show')

//normal route
// router.get('/movies', async (ctx) => {
//   // ctx.view.share({movie:'my awsome movie'})
//   return ctx.view.render('pages/movies',{movie:'another my awsome movie'})
// }).as('movies.show')

//resource route
// router.get('/movies', () => {}).as('movies.index')
// router.get('/movies/my-awesome-movie', () => {}).as('movies.show')
// router.get('/movies/create', () => {}).as('movies create')
// router.post('/movies', () => {}).as('movies.store')
// router.get('/movies/my-awesome-movie/edit', () => {}).as('movies.edit')
// router.put('/movies/my-awesome-movie', () => {}).as('movies.update')
// router.delete('/movies/my-avesome-movie', () => {}).as('movies destroy')
