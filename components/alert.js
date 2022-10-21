import Container from './container'
import cn from 'classnames'
import { EXAMPLE_PATH } from '../lib/constants'

export default function Alert({ preview, user, loading }) {
  return (
    <div
      className={cn('border-b', {
        'bg-accent-7 border-accent-7 text-white': preview,
        'bg-accent-1 border-accent-2': !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              This is page is a preview.{' '}
              <a
                href="/api/exit-preview"
                className="underline hover:text-cyan duration-200 transition-colors"
              >
                Click here
              </a>{' '}
              to exit preview mode.
            </>
          ) : (
            <>
              {/*
              The source code for this blog is{' '}
              <a
                href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
                className="underline hover:text-success duration-200 transition-colors"
              >
                available on GitHub
              </a>
              .
              */}
              More features available soon, stay tuned!!! &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                {!loading &&
                  (user ? (
                        <span className="inline-flex items-center justify-between w-[6rem]">
                        <a href="/api/logout">Logout</a>
                        <a href="/profile" ><img src={user.picture} className="w-[1.5rem] h-[1.5rem] hover:scale-150" ></img></a>
                        </span>
                  ) : (
                      <a href="/api/login">Login</a>
              ))}
            </>
          )}
        </div>
      </Container>
    </div>
  )
}
