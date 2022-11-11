import {Alert, Meta, Footer} from '@components/index'

export default function Layout({ preview, children, user, loading, alertIn, alertOut}) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} user={user} loading={loading} alertIn={alertIn} alertOut={alertOut} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
