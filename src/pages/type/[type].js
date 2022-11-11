import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import {Container, Header, Layout, PostList, PostTitle} from '@components/index'
import { getAllPostsByType } from '@lib/api'
import { getAppParams } from '@lib/api2'
import { CMS_NAME, APP_GENRE_COMING_SOON_ID } from '@lib/constants'
import { useFetchUser } from '@lib/user'



export default function Post({ post, preview, type, colors, alert }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  const { user, loading } = useFetchUser()
  
   return (
    <Layout preview={preview} user={user} loading={loading} /* alertIn={alert['Alert: '+ type] ? alert['Alert: '+ type]:''} 
                                                            alertOut={alert ? alert['Alert: unlogged']:''}*/ >
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {type} | Next.js Blog Example with {CMS_NAME}
                </title>

              </Head>
              <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
                {type} List 
              </h2>
              <PostList post={post} colors={colors}  />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}



export async function getStaticProps({ params, preview = false }) {

    const data = await getAllPostsByType(params.type)
    const {colors, alert} = await getAppParams()
  
    return {
      props: {
        preview,
        post: data || [],
        type: params.type ,
        colors,
        alert
      },
    }
  }
  
  export async function getStaticPaths() {
    let paths = []
    const {type} = await getAppParams()
    for (const [key, value] of Object.entries(type)) {
      paths.push(key.substring(key.indexOf(':')+1).trim())
    }

    return {
      paths: paths?.map(t => `/type/${t}`) ?? [],
      fallback: true,
    }
  }