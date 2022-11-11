import Head from 'next/head'
import {Container, Intro, Layout, MoreStories, Paginate} from '@components/index'
import { getPaginatePosts } from '@lib/api'
import { getAppParams } from '@lib/api2'
import { useFetchUser } from '@lib/user'

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
  const {firstPage, perPage, colors, alert} = await getAppParams()
  const skip = Number(firstPage)+Number(perPage)*(params.page-1)
  const pagePosts = (await getPaginatePosts(preview, skip, perPage)) ?? []
  return {
    props: { preview, pagePosts, firstPage, perPage, page: params.page, colors, alert },
  }
}

export async function getStaticPaths({ preview = false }) {
  const {firstPage, perPage} = await getAppParams()
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
