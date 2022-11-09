import Link from 'next/link'
import {Avatar, CoverImage, DateComponent, Tags} from '@components/index'

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  tagList,
  tagColors,
}) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link href={`/posts/${slug}`}>
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          {tagList && <Tags list={tagList} colors={tagColors} />}
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </section>
  )
}
