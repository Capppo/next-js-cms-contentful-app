import Link from 'next/link'

const enumerate = (navigate, path, filter,page, last) => {
  let i= 0
  do {
    i++
    navigate.push({text: i, href: href(path,i,filter), nolink: i == page ? true:false})
  }
  while (i < last)
}

const href = (path,page,filter) => {
  switch (path) {
    case '/page' :
      return path+'/'+page
    case '/filter' :
      if (filter?.length > 0) {
        let tagList = filter.map((t) => {return t.id})
        return path+'?page='+page+'&tags='+tagList?.join(',')
      } else {
        return '/'
      }      
    default:
      return '/'
  }
}

export default function Paginate({paginate}) {
    const {firstPage, perPage, page, totalItems, path, filter} = paginate
    const last = Math.ceil((totalItems-firstPage)/perPage)
    let navigate = []
    if (page != 0) {navigate.push({text: "First", href: "/"})}
    if (Number(page)-1  > 1) {navigate.push({text: "Prev", href: href(path,Number(page)-1,filter)})}
    enumerate(navigate, path, filter, page, last)
    if (Number(page)+1 < last) {navigate.push({text: "Next", href: href(path,Number(page)+1, filter)})}
    if (page < last) {navigate.push({text: "Last", href: href(path,last,filter)})}

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