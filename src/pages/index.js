import Head from 'next/head'
import {Container, Intro, HeroPost, Layout, MoreStories, Paginate} from '@components/index'
import { getAllPostsForHome, getAllKeyValue } from '@lib/api'
import { useFetchUser } from '@lib/user'


export default function Index({ preview, allPosts, firstPage, perPage, page, colors }) {
  const heroPost = allPosts?.items[0]
  const morePosts = allPosts?.items.slice(1)
  const { user, loading } = useFetchUser()
  
  const paginate = {firstPage, perPage, page, totalItems: allPosts?.total, path: '/page'} 
  
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
  const {firstPage, perPage, colors} = await getPaginate()
  const allPosts = (await getAllPostsForHome(preview,firstPage)) ?? []
  return {
    props: { preview, allPosts, firstPage, perPage, page: 0 , colors},
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