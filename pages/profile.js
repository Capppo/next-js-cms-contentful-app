import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../components/container'
import PostBody from '../components/post-body'
import MoreStories from '../components/more-stories'
import Header from '../components/header'
import PostHeader from '../components/post-header'
import SectionSeparator from '../components/section-separator'
import Layout from '../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts, getAllKeyValue } from '../lib/api'
import { useStatistics} from '../lib/api2'
import PostTitle from '../components/post-title'
import { CMS_NAME } from '../lib/constants'
import { useFetchUser } from '../lib/user'
import TabsGroup from '../components/tabs-group'

export default function Profile({ post, morePosts, preview, keyValue, rows }) {
  const router = useRouter()
/*
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }
*/
  const stats = []
  let isLoading = false, isError = false
  const { user, loading } = useFetchUser()

  // these hook is called outside "if block" because otherwise React founds different hooks for rerender
  const { data: data1, isLoading: isL1, isError: isE1 } = useStatistics('/stat?user='+user?.name);
  const { data: data2, isLoading: isL2, isError: isE2 } = useStatistics('/stats');
  
  if (user?.name) {
    stats.push({title: "Downloads", data: data1})
    isLoading = isLoading || isL1
    isError = isError || isE1
  }

  if (user?.properties.isAdmin) {
    stats.push({title: "All user", data: data2})
    isLoading = isLoading || isL2
    isError = isError || isE2
  }

 
 
  return (
    <Layout preview={preview} user={user} loading={loading}>
      <Container>
        <Header />
        {isLoading || isError ? (
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
            {isLoading 
             ? (<span>Loading User Activities...</span>)
             : (<span>Unable to fetch statistics!</span>)
            }
        </h2>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {'Statistics'} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={'post.coverImage.url'} />
              </Head>
              <TabsGroup  stats={stats} user={user} />
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

