import Head from 'next/head'
import {Container, FilterList, Intro, Layout, MoreStories, Paginate} from '@components/index'
import { getFilteredPosts, getAllKeyValue } from '@lib/api'
import { getAppParams } from '@lib/api2'
import { useFetchUser } from '@lib/user'

const aggregateTag = (morePosts, filter) => {
  let applicableTag = [], appliedTag = []
  morePosts.map(post => {
    post.contentfulMetadata.tags.map (tag => {
      if (filter.findIndex(t => t == tag.id) == -1) {
        if (applicableTag.findIndex(t => t.id == tag.id) == -1) {
          applicableTag.push({id: tag.id, name: tag.name})
        } 
      } else {
        if (appliedTag.findIndex(t => t.id == tag.id) == -1) {
          appliedTag.push({id: tag.id, name: tag.name})
        }
      }
    })
  })
  return {applicableTag,appliedTag}
}

export default function Page({ preview, pagePosts, firstPage, perPage, page, filter, colors }) {
  
  const morePosts = pagePosts?.items || []
  const {applicableTag,appliedTag} = aggregateTag(morePosts, filter)
  const { user, loading } = useFetchUser()
  
  const paginate = {firstPage, perPage, page, totalItems: pagePosts?.total, path: '/filter', filter: appliedTag} 
  //console.log("Paginate:", paginate, applicableTag,appliedTag,filter)
  
  return (
    <>
      <Layout preview={preview} user={user} loading={loading}>
        <Head>
          <title>Have a fun! with {user?.name}</title>
        </Head>
        <Container>
          <Intro user={user} />
          <FilterList applicable={applicableTag} applied={appliedTag} colors={colors}  />
          <Paginate  paginate={paginate} />
          {morePosts.length > 0 
          ? <MoreStories posts={morePosts} tagColors={colors}/>
          : <span>no more posts</span>
          }
          <Paginate  paginate={paginate} />
        </Container>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context) {
  const filter = context.query.tags ? context.query.tags.split(","):[]
  const preview = context.query.preview ? true:false
  const page = context.query.page ?? 1
  const {perPage, colors, alert} = await getAppParams()
  const firstPage = 0
  const skip = Number(perPage)*(page-1)
  const pagePosts = (await getFilteredPosts(preview, skip, perPage, filter)) ?? []
  return {
    props: { preview, pagePosts, firstPage, perPage, page: page, filter, colors, alert},
  }
}
