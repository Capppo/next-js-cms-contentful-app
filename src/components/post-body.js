import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS} from '@contentful/rich-text-types'
import {markdownStyles} from '@components/index'
import {RichTextAsset} from '@components/index'
import {FILE_EXTENTIONS} from '@lib/constants'

const isNumber =(n) => { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

const Bold = ({ children }) => <p className="bold">{children}</p>; // EXAMPLE FROM NPM

const Text = ({ children }) => <p className="align-center">{children}</p>; // EXAMPLE FROM NPM

const slash = (baseUrl,uri, userName, userToken) => {
  
  if ( baseUrl.substring(baseUrl.length-1) == "/" ) {baseUrl=baseUrl.substring(0,baseUrl.length-2)}
  if ( uri.substring(0,1) == "/" ) {uri=uri.substring(1)}

  return baseUrl + "/"+ uri + "&user=" + userName + "&jwt=" + userToken?.access_token
}

const InlineLink = ({uri, text, baseUrl, userName, userToken}) => {
  /*const mixpanel = useMixpanel()
  const clickTracer = (title) => {
    mixpanel.track("LINK: "+title);
  }*/
  const href = slash(baseUrl, uri, userName, userToken)
  return (
    <>
      {uri
        ? <a href={href} target="_blank" rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-600 hover:font-semibold" /*onClick={() => clickTracer(text)}*/>
          {text}
          </a>
        : <div>
            {text}
          </div>
      
      }
    </>
    
  )
}

const InlineVimeo = ({uri, text}) => {
  var src = ''

  let arr = uri.split('/')
  src = arr[arr.length-1]

 return (
  <p class="iframe-container">
    <iframe title={text} src={process.env.REACT_APP_VIMEO_EMBED_PATH + src} width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
  </p>
)
}

const InlineYoutube = ({uri, text}) => {
  var src = ''
  if (uri.includes("youtu.be")) {
    let arr = uri.split('/')
    src = arr[arr.length-1]
  }

  if (uri.includes("youtube.com/watch")) {
    uri=uri+'&'
    let u1 = uri.substr(uri.lastIndexOf('v=')+2)
    src = u1.substr(0,u1.indexOf('&'))
  }

  return (
    <p class="iframe-container">
      <iframe title={text} src={"https://www.youtube.com/embed/" + src} width="640" height="360"  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" frameBorder="0" allowFullScreen></iframe>
    </p>
  )
}

const addExtention = (file) => {
  if (!file) return ''
 const index = FILE_EXTENTIONS.findIndex(el => {
    return el == file?.substring(file?.length-3)
 })
 if (index == -1) {return file+'.mkv'}
 return file
}

const addEpisode = (text, num) => {
  if (!text) {return ('Episodio ' + num.toString().padStart(2, '0'))}
  return text
}

const BuildLink =({content, baseUrl, userName, userToken}) => {
    const links = []
    const noHeader = 1
    content?.map((row,ir) => {
      const linkFields = []
      row?.content.map((cel,ic) => {
        if (cel?.nodeType == 'table-cell' || cel?.nodeType == 'table-header-cell') {
          if (cel?.nodeType == 'table-header-cell') {noHeader = 0}
            else {linkFields.push(cel?.content[0].content[0].value)}
        }
      })
      if (linkFields.length == 1) {linkFields.splice(0,0,ir+noHeader,'')}
      if (linkFields.length == 2) {
        if (isNumber(linkFields[0]) ) {
          linkFields.splice(1,0,'')
        } else
          linkFields.splice(0,0,ir+noHeader)
        }
      links.push(linkFields)
    })
    if (links[0].length == 0) {links.splice(0,1)}

    return (
      <div>
      {links.map((l,i) => {
        return (
          <div key={'build'+i}  className="mb-4">
            <InlineLink uri={addExtention(l[2])} text={l[0]+'. '+addEpisode(l[1],l[0])} baseUrl={baseUrl} userName={userName} userToken={userToken} />
          </div>
        )
      })

      }
      </div>
    )
}

const customMarkdownOptions = (content, baseUrl, userName, userToken) => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <RichTextAsset
        id={node.data.target.sys.id}
        assets={content.links.assets.block}
      />
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-purple-800 font-semibold">{children}</h3>,
    [BLOCKS.QUOTE]: (node, children) => <div className="blockquote">{children}</div>,
    [INLINES.HYPERLINK]: node => {
      const { uri} = node.data;
      const text = node.content[0].value
      const data = node.content[0].data

      let isVideoLink = false
      if (uri.includes("player.vimeo.com/video") || uri.includes("vimeo.com")) {
        isVideoLink = true
        return <InlineVimeo uri={uri} text={text} />
      }
      if (uri.includes("youtube.com/watch") || uri.includes("youtu.be")) {
        isVideoLink = true
        return <InlineYoutube uri={uri} text={text} />
      }
      if (!isVideoLink) {
        //this is to rendere external link as like embedded, but the info must to be previously fetched
        if (text.indexOf(">") === 0) 
              { return <EmbeddedExternalEntry uri={uri} text={text.substr(1)} data={data} /> }
        else  {return <InlineLink uri={uri} text={text} baseUrl={baseUrl} userName={userName} userToken={userToken} />}
      }
      
      
      
    },
    [BLOCKS.TABLE]: node => {
      return <BuildLink content={node.content} baseUrl={baseUrl} userName={userName} userToken={userToken}/>
    }
  },
})

export default function PostBody({ content, baseUrl , userName, userToken}) {
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className={markdownStyles['markdown']}>
        {documentToReactComponents(
          content.json,
          customMarkdownOptions(content, baseUrl, userName, userToken )
        )}
      </div>
    </div>
  )
}
