import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPostsForHome, getAllKeyValue } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import { useFetchUser } from '../lib/user'
import Paginate from '../components/paginate'

export default function Index({ preview, allPosts, firstPage, perPage, page }) {
  const heroPost = allPosts?.items[0]
  const morePosts = allPosts?.items.slice(1)
  const { user, loading } = useFetchUser()
  
  const paginate = {firstPage, perPage, page, totalItems: allPosts?.total} 
  
  return (
    <>
      <Layout preview={preview} user={user} loading={loading}>
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
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
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
  const {firstPage, perPage} = await getPaginate()
  const allPosts = (await getAllPostsForHome(preview,firstPage)) ?? []
  return {
    props: { preview, allPosts, firstPage, perPage, page: 0 },
  }
}

export async function getPaginate() {
  const data = await getAllKeyValue()
  const findKey = (el) => el.key == keyToSearch
  let keyToSearch = "First page posts"
  let firstPage = data[data.findIndex(findKey)]?.value
  keyToSearch = "Post per page"
  let perPage = data[data.findIndex(findKey)]?.value
  console.log(firstPage,perPage)
  return {
    firstPage: firstPage || 1,
    perPage: perPage || 2,
  }
}