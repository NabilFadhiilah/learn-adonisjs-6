import app from "@adonisjs/core/services/app"
import { readdir, readFile } from 'node:fs/promises'
import { MarkdownFile } from "@dimerapp/markdown"
import { Exception } from "@adonisjs/core/exceptions"

export class MovieService {
  static getSlugUrl(slug: String){
    if (!slug.endsWith('.md')) {
      slug += '.md'
    }
    return app.makeURL(`resources/movies/${slug}`)
  }

  static async getSlugs() {
    const files = await readdir(app.makeURL('resources/movies'))
    return files.map((file) => file.replace('.md', ''))
  }

  static async read(slug: string) {
    try {
      const url = this.getSlugUrl(slug)
      const file = await readFile(url, 'utf8')
      const md = new MarkdownFile(file)

      await md.process()

      return md
    } catch (error) {
      throw new Exception(`Could not find a movie called ${slug}`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
  }
}
