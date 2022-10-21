import axios  from "axios"

var options = {
  method: 'POST',
  url: 'https://alycante.auth0.com/oauth/token',
  headers: {'content-type': 'application/json'},
  data: ({
    grant_type: 'client_credentials',
    client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'download-file'
  })
};

const token = async (req, res) => {
   /* console.log("Options: ",options)
  res.status(200).json({"access_token":"ha ha h a"})*/
  try {
    const response = await axios.request(options)
    res.status(200).send(response.data)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    console.error("ERROR token: ", error.message)
    console.error(error?.response)
    res.status(500).end(errorMessage)
  }
}


export default token
