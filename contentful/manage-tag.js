var contentful = require('contentful-management')
require('dotenv').config({ path: '.env.local' })

var client = contentful.createClient({
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT,
})

var tagGroups = ['Genre', 'Year']
var colors = ['red','orange','amber','yellow','lime', 'green','emerald','teal','sky','blue','indigo','violet','purple','fuchsia','pink','rose']

const createEntry = async (env,entry,color) => {
  env.createEntry('keyValue', {
    fields: {
      key: {
        'en-US': entry,
      },
      value: {
        'en-US': ` bg-${color}-300 border-${color}-400 border`,
      }
    }
  })
  .then(e => console.log(e))
  .catch("Error creating entry", console.error)  
}

async function run() {
  // This API call will request a space with the specified ID
  var space = await client.getSpace('9hfh398lg64w')

  var environment = await space.getEnvironment('master')

  console.log (`this function delete (if unpublished) all Genre and Year keyValue 
  and recreate it reading all Genre and Year tags group, 
  REMOVE comment if you REALLY want to do it.`)

  // Now that we have a space, we can get entries from that space
  environment.getEntries({content_type: 'keyValue'})
  .then((entries) => {
    entries.items.map (item => {
      tagGroups.map(g => {
        if (item.fields.key['en-US'].includes(g)) {
          console.log(item.fields.key, item.fields.value, item.sys.id) //
          environment.getEntry(item.sys.id)
          .then(entry => {
           //entry.delete()
          })
          //.then(() => console.log(item.sys.id,`Entry deleted.`))
          .catch("Error deleting entry", console.error)                //
        }
      })
      
    })
    
  })
  environment.getTags()
  .then((entries) => {
    let index= 0
    entries.items.map ((item) => {
      if (item.name.includes('Genre')) {
        //createEntry(environment,item.name,colors[index])
        index++
      }
      if (item.name.includes('Year')) {
        //createEntry(environment,item.name,'stone')
      }
    })
    
  })
}

run()
