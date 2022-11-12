import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import {Container, PostBody, MoreStories, Header, PostHeader} from '@components/index'
import {SectionSeparator, Layout, PostTitle, PostSeason} from '@components/index'
import { getAllPostsWithSlug, getPostAndMorePosts } from '@lib/api'
import { getAppParams } from '@lib/api2'
import { CMS_NAME, APP_GENRE_COMING_SOON_ID } from '@lib/constants'
import { useFetchUser } from '@lib/user'


export default function Post({ post, morePosts, preview, type, colors, alert }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  const { user, loading } = useFetchUser()

  const urlBuilder = (type) => {
    if (type) {
      let baseUrl = type['Type: '+post.type]
      if ( baseUrl.substring(baseUrl.length-1) == "/" ) {baseUrl=baseUrl.substring(0,baseUrl.length-2)}
      if (post.folderName) {baseUrl = baseUrl+"/"+post.folderName}
      return baseUrl
    } else return ''
  }

  const isComingSoon = (post) => {
    let isTrue= false
    post?.contentfulMetadata?.tags.map(t => {
      if(t.id == APP_GENRE_COMING_SOON_ID) {isTrue=true}
    })
    return isTrue
  }

  const alertIn = (post) => {
    if (!alert) {return ""}
    return isComingSoon(post) ? alert['Alert: coming soon']: alert['Alert: post'] ? alert['Alert: post']:''
  }
  
  const baseUrl = urlBuilder(type)

  return (
    <Layout preview={preview} user={user} loading={loading} alertIn={alertIn(post)} alertOut={alert ? alert['Alert: post unlogged']:''} >
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-16 ">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.coverImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} baseUrl={baseUrl} userName={user?.name} userToken={user?.token} />
              {post.download && user?.properties?.download
                ? <PostBody content={post.download} baseUrl={baseUrl} userName={user?.name} userToken={user?.token} />
                : ''}
              {post?.seasonsCollection?.items.length > 0 && user?.properties?.download
                ? <PostSeason content={post?.seasonsCollection?.items } baseUrl={baseUrl} userName={user?.name} userToken={user?.token} />
                : ''}
            </article>
            <SectionSeparator />
            {morePosts && morePosts.length > 0 && (
              <MoreStories posts={morePosts} tagColors={colors} />
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {

  const data = await getPostAndMorePosts(params.slug, preview)
  const {colors, alert, type} = await getAppParams()

  return {
    props: {
      preview,
      post: data?.post ?? null,
      morePosts: data?.morePosts ?? null,
      type,
      colors,
      alert 
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  }
}
