import Link from 'next/link'
import {Avatar, CoverImage, DateComponent, Tags} from '@components/index'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  type,
  tagList,
  tagColors
}) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className="text-3xl mb-3 leading-snug flex justify-between">
        <Link href={`/posts/${slug}`}>
          <a className="hover:underline">{title}</a>
        </Link>
        <span className="text-xl ">{type}</span>
      </div>
      <div className="text-lg mb-4">
        <DateComponent dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      {tagList && <Tags list={tagList} colors={tagColors} />}
      {author && <Avatar name={author.name} picture={author.picture} />}
    </div>
  )
}
