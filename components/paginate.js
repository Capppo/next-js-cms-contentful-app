import { COOKIE_NAME_PRERENDER_BYPASS } from 'next/dist/server/api-utils'
import Link from 'next/link'

const enumerate = (navigate, page, last) => {
  let i= 0
  do {
    i++
    navigate.push({text: i, href: `/page/${i}`, nolink: i == page ? true:false})
  }
  while (i < last)
}

export default function Paginate({paginate}) {
    const {firstPage, perPage, page, totalItems} = paginate
    const last = Math.ceil((totalItems-firstPage)/perPage)
    let navigate = []
    if (page != 0) {navigate.push({text: "First", href: "/"})}
    if (page > 1) {navigate.push({text: "Prev", href: `/page/${Number(page)-1}`})}
    enumerate(navigate, page, last)
    if (Number(page)+1 < last) {navigate.push({text: "Next", href: `/page/${Number(page)+1}`})}
    if (page < last) {navigate.push({text: "Last", href: `/page/${last}`})}

  return (
    <div className="flex justify-center text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight mb-8 mt-8 ">
        {navigate.map((n,i) => {
            return (
                    n.nolink
                    ? <div key={i} className="ml-4 text-blue-600">
                        {n.text}
                      </div>
                    : <Link href={n.href} key={i}>
                        <a className="ml-4 hover:underline">{n.text}</a>
                      </Link> 
                    
            )
        })
        }
    </div>
  )
}