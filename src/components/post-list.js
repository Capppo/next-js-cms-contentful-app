import { useRouter } from 'next/router'
import {PostItem} from '@components/index'



export default function PostList({ post, preview, type, colors, alert }) {

  //console.log("Posts List:", post, type)

  return (
    <div className="flex flex-col  justify-start mb-2 border">
      {post.map((p,i )=> {
        return (
          <PostItem key={'post'+i}  post={p}  seq={i} colors={colors} />
        )
      })}
    </div>
  
  ) 
}
