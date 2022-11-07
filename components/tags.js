import { useRouter } from 'next/router'



export default function Tags({ list, colors, switchList}) {

  const router = useRouter()

  let tagList = []
  list.map(tag => {
    let tagValue = tag.name.split(':')
    let color = colors?.find(el => el.tag == tag.name)?.className
    tagList.push({id: tag.id, name: tagValue[tagValue.length-1].trim(), color: color ? color:'' })
  })
  
  const handleClick = (e) => {
    e.preventDefault
    const tag = e.target.attributes.href.value
    if (switchList) {switchList(tag)}
    else {
      router.push("/filter?tags="+tag)
    }
  }

  return (
    <div className="flex flex-row justify-start mb-4">
      {tagList.map((tag,index) => {
        return (
          <span  key={tag.name+index}       
              href={tag.id}
              className={`rounded-full ${tag.color} mr-4 px-2 py-1 font-semibold hover:underline`} 
              onClick={(e) => handleClick(e)} >
              {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
          </span>
        )
      })
      }
    </div>
  )
}