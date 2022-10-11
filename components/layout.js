import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ preview, children, user, loading}) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} user={user} loading={loading} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
