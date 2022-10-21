import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS} from '@contentful/rich-text-types'
import markdownStyles from './markdown-styles.module.css'
import RichTextAsset from './rich-text-asset'

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
    <a href={href} target="_blank" rel="noopener noreferrer" 
       className="text-blue-600 hover:text-blue-600 hover:font-semibold" /*onClick={() => clickTracer(text)}*/>
        {text}
    </a>
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
      
      return <InlineLink uri={uri} text={text} baseUrl={baseUrl} userName={userName} userToken={userToken} />
      
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
