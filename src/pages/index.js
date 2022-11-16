import Head from 'next/head'
import {Container, Intro, HeroPost, Layout, MoreStories, Paginate} from '@components/index'
import { getAllPostsForHome } from '@lib/api'
import { getAppParams } from '@lib/api2'
import { useFetchUser } from '@lib/user'


export default function Index({ preview, allPosts, firstPage, perPage, page, colors, alert }) {
  const heroPost = allPosts?.items[0]
  const morePosts = allPosts?.items.slice(1)
  const { user, loading } = useFetchUser()
 
  const paginate = {firstPage, perPage, page, totalItems: allPosts?.total, path: '/page'} 
  
  return (
    <>
      <Layout preview={preview} user={user} loading={loading} alertIn={alert ? alert['Alert: logged']:''} alertOut={alert ? alert['Alert: unlogged']:''} >
        <Head>
          <title>Have a fun! with {user?.name}</title>
        </Head>
        <Container>
          <Intro user={user} />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
              tagList={heroPost.contentfulMetadata?.tags}
              tagColors={colors}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} tagColors={colors} />}
          {firstPage < allPosts?.total
          ? <Paginate  paginate={paginate} />
          : ''
          }
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const {firstPage, perPage, colors, alert} = await getAppParams()
  const allPosts = (await getAllPostsForHome(preview,firstPage)) ?? []
  
  return {
    props: { preview, allPosts, firstPage, perPage, page: 0 , colors, alert},
  }
}

