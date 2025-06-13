/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import MoviesController from '#controllers/movies_controller';
import RedisController from '#controllers/redis_controller';

router.get('/', [MoviesController,'index']).as('home')
router.get('/movies/:slug', [MoviesController,'show']).as('movies.show').where('slug',router.matchers.slug( ))
router.delete('/redis/flush',[RedisController,'flush']).as('redis.flush')
router.delete('/redis/:slug',[RedisController,'destroy']).as('redis.destroy')
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
