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
import DirectorsController from '#controllers/directors_controller';
import WritersController from '#controllers/writers_controller';
import RegisterController from '#controllers/auth/register_controller';
import LoginController from '#controllers/auth/login_controller';


router.get('/', [MoviesController,'index']).as('home')
router
  .get('/movies/:slug', [MoviesController,'show'])
  .as('movies.show')
  .where('slug',router.matchers.slug( ))

router.get('/directors',[DirectorsController,'index']).as('directors.index')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers',[WritersController,'index']).as('writers.index')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

router.delete('/redis/flush',[RedisController,'flush']).as('redis.flush')
router.delete('/redis/:slug',[RedisController,'destroy']).as('redis.destroy')

router
  .group(() => {
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
  })
  .prefix('/auth')
  .as('auth')
