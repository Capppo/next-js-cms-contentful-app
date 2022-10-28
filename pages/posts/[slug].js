import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts, getAllKeyValue } from '../../lib/api'
import PostTitle from '../../components/post-title'
import PostSeason from '../../components/post-season'
import { CMS_NAME } from '../../lib/constants'
import { useFetchUser } from '../../lib/user'

export default function Post({ post, morePosts, preview, keyValue }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  const { user, loading } = useFetchUser()

  const urlBuilder = (keyValue) => {
    if (keyValue) {
      const found = keyValue.find(element => element.key == post.type);
      let baseUrl = found.value
      if ( baseUrl.substring(baseUrl.length-1) == "/" ) {baseUrl=baseUrl.substring(0,baseUrl.length-2)}
      if (post.folderName) {baseUrl = baseUrl+"/"+post.folderName}
      return baseUrl
    } else return ''
  }
  
  const baseUrl = urlBuilder(keyValue)

  return (
    <Layout preview={preview} user={user} loading={loading}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
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
              <MoreStories posts={morePosts} />
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, preview)
  const data2 = await getAllKeyValue()

  return {
    props: {
      preview,
      post: data?.post ?? null,
      morePosts: data?.morePosts ?? null,
      keyValue: data2
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
