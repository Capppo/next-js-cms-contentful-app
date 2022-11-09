import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS} from '@contentful/rich-text-types'

import document from '@graphql-response/postCollection.json'

const options = {
    renderNode: {
        [BLOCKS.TABLE]: node => {
            return <BuildLink content={node.content} />
          }

    },
  }

const BuildLink =({content}) => {

    const links = []
    content?.map((row,ir) => {
      const linkFields = []
      row?.content.map((cel,ic) => {
        if (cel?.nodeType == 'table-cell') {
          linkFields.push(cel?.content[0].content[0].value)
        }
      })
      links.push(linkFields)
    })
    if (links[0].length == 0) {links.splice(0,1)}
    

    return (
      <>
      {links.map((l,i) => {
        return (
          <div>
            row {i} * {l[0]} * {l[1]} * {l[2]}
          </div>
        )
      })

      }
      </>
    )
}

export default function Table(props) {
    //console.log(document.data.postCollection.items)
    return (
        <div className="ml-8 mt-8">
            {documentToReactComponents(document.data.postCollection.items[0].download.json, options)}
        </div>
    )
  }