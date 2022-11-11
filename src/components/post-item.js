import Link from "next/link"
import {Tags} from '@components/index'


export default function PostItem({ post, seq, colors }) {
  let bg = " bg-slate-100 "
  if (seq % 2 == 0) {bg=""}

  return (
    <div className={`grid grid-flow-col sm:grid-cols-11 lg:grid-cols-12 justify-start items-center ${bg}`}>
      <div className="ml-2 sm:hidden lg:block col-span-1 ">{post.date.substring(0,10)}</div>
      <Link href={`/posts/${post.slug}`}>
        <a className="hover:underline">
          <img  src={post.coverImage.url} className=" col-span-1 "/>
        </a>
      </Link>
      <div className="col-span-5 ml-2" ><Link href={`/posts/${post.slug}`}>{post.title}</Link></div>
      <div className="col-span-5 border-0 " ><Tags  list={post.contentfulMetadata.tags} colors={colors} /></div>
    </div>
  ) 
}