
const baseUrl = "/abcdef/"
const uri = "/12345/"


const slash = (baseUrl,uri) => {
  
    if ( baseUrl.substring(baseUrl.length-1) == "/" ) {baseUrl=baseUrl.substring(0,baseUrl.length-2)}
    if ( uri.substring(0,1) == "/" ) {uri=uri.substring(1)}
  
    return baseUrl+"/"+uri
  }

  const href = slash(baseUrl, uri)

  console.log(href)