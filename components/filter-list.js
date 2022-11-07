import { useRouter } from 'next/router'
import Tags from './tags'

const switchList = (applicable, applied, action, e) => {

    switch (action) {
      case 'add':
        const index = applicable.findIndex(el => el.id == e) 
        applied.push(applicable[index])
        break;
      case 'remove':
        applied = applied.filter(arrayItem => arrayItem.id !== e);
        break;
      default:
        console.log(`Sorry, we are out of ${action}.`);
    }
    return applied
}



export default function FilterList({ applicable,applied,colors}) {

    const router = useRouter()

    const href = applied => {
      let h=""
      let tagList = applied.map((t) => {return t.id})
      if (tagList.length == 0) {h="/"}
      else {h="/filter?tags="+tagList.join(",")} 
      router.push(h)
    }

    const switchApplicable = e => {
      href(switchList(applicable,applied,'add',e))
    }  
    
    const switchApplied = e => {
      href(switchList(applicable,applied,'remove',e))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 ">
            {applicable && <Tags list={applicable} colors={colors} switchList={switchApplicable} />}
            {applied && <Tags list={applied} colors={colors} switchList={switchApplied} />}
       </div>
    )
  }