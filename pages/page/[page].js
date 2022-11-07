import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Paginate from '../../components/paginate'
import { getPaginatePosts, getAllKeyValue } from '../../lib/api'
import Head from 'next/head'
import { useFetchUser } from '../../lib/user'

export default function Page({ preview, pagePosts, firstPage, perPage, page, colors }) {
  
  const morePosts = pagePosts?.items || []
  const { user, loading } = useFetchUser()
  
  const paginate = {firstPage, perPage, page, totalItems: pagePosts?.total, path: '/page'} 
  
  return (
    <>
      <Layout preview={preview} user={user} loading={loading}>
        <Head>
          <title>Have a fun! with {user?.name}</title>
        </Head>
        <Container>
          <Intro user={user} />
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

export async function getStaticProps({ params,preview = false }) {
  const {firstPage, perPage, colors} = await getPaginate()
  const skip = Number(firstPage)+Number(perPage)*(params.page-1)
  const pagePosts = (await getPaginatePosts(preview, skip, perPage)) ?? []
  return {
    props: { preview, pagePosts, firstPage, perPage, page: params.page, colors },
  }
}

export async function getStaticPaths({ preview = false }) {
  const {firstPage, perPage} = await getPaginate()
  const allPosts = await getPaginatePosts(preview, firstPage, perPage)
  const numPages = Math.ceil((allPosts?.total-allPosts?.skip)/allPosts?.limit)
  const paths = []
  let i = 0;
  do {
    i = i + 1;
    paths.push(`/page/${i}`)
  } while (i < numPages);
  return {
    paths: paths,
    fallback: true,
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