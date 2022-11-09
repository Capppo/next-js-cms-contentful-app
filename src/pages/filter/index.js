import Head from 'next/head'
import {Container, FilterList, Intro, Layout, MoreStories, Paginate} from '@components/index'
import { getFilteredPosts, getAllKeyValue } from '@lib/api'
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
  const { perPage, colors} = await getPaginate()
  const firstPage = 0
  const skip = Number(perPage)*(page-1)
  const pagePosts = (await getFilteredPosts(preview, skip, perPage, filter)) ?? []
  return {
    props: { preview, pagePosts, firstPage, perPage, page: page, filter, colors},
  }
}

export async function getPaginate() {
  let colors = []
  const data = await getAllKeyValue()
  const findKey = (el) => el.key == keyToSearch
  let keyToSearch = "First page posts"
  let firstPage = data[data.findIndex(findKey)]?.value
  keyToSearch = "Post per page"
  let perPage = data[data.findIndex(findKey)]?.value
  keyToSearch = "Tag groups"
  let tagGroups = data[data.findIndex(findKey)]?.value.split(',')
  data.map(el => {
    tagGroups.map(g => {
      if (el.key.includes(g.trim())) {colors.push({tag: el.key, className: el.value})}
    })
  })
  
  return {
    firstPage: firstPage || 1,
    perPage: perPage || 2,
    colors: colors
  }
}