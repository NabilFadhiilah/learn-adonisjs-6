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
import AdminMoviesController from '#controllers/admin/movies_controller';
import AdminDashboardController from '#controllers/admin/dashboard_controller';
import RedisController from '#controllers/redis_controller';
import DirectorsController from '#controllers/directors_controller';
import WritersController from '#controllers/writers_controller';
import RegisterController from '#controllers/auth/register_controller';
import LoginController from '#controllers/auth/login_controller';
import LogoutController from '#controllers/auth/logout_controller';
import { middleware } from './kernel.js';
import HomeController from '#controllers/home_controller';
import WatchlistsController from '#controllers/watchlists_controller';
import ProfilesController from '#controllers/profiles_controller';
import AvatarsController from '#controllers/avatars_controller';


router.get('/', [HomeController,'index']).as('home')

router.get('/avatars/:filename',[AvatarsController,'show']).as('avatars.show')

router.get('/movies',[MoviesController,'index']).as('movies.index')
router
  .get('/movies/:slug', [MoviesController,'show'])
  .as('movies.show')
  .where('slug',router.matchers.slug( ))

router
  .group(() => {
    router.get('/watchlist', [WatchlistsController, 'index']).as('index')
    router.post('/watchlists/:movieId/toggle', [WatchlistsController, 'toggle']).as('toggle')
    router
      .post('/watchlists/:movieId/toggle-watched', [WatchlistsController, 'toggleWatched'])
      .as('toggle.watched')
  })
.as('watchlists')
.use(middleware.auth())

router.get('/directors',[DirectorsController,'index']).as('directors.index')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers',[WritersController,'index']).as('writers.index')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

router.delete('/redis/flush',[RedisController,'flush']).as('redis.flush')
router.delete('/redis/:slug',[RedisController,'destroy']).as('redis.destroy')

router.get('/profile/edit',[ProfilesController,'edit']).as('profile.edit').use(middleware.auth())
router.put('/profiles',[ProfilesController,'update']).as('profile.update').use(middleware.auth())
router.get('/profiles/:id',[ProfilesController,'show']).as('profile.show')

router
  .group(() => {
    router.get('/register', [RegisterController, 'show']).as('register.show').use(middleware.guest())
    router.post('/register', [RegisterController, 'store']).as('register.store').use(middleware.guest())
    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())
    router.post('/logout',[LogoutController,'handle']).as('logout').use(middleware.auth())
  })
.prefix('/auth')
.as('auth')

router
  .group(()=>{
    router.get('/', [AdminDashboardController, 'handle']).as('dashboard')
    router.get('/movies',[AdminMoviesController,'index']).as('movies.index')
  })
.prefix('/admin')
.as('admin')
.middleware(middleware.admin())
