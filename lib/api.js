const POST_GRAPHQL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
  }
}
excerpt
content {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
type
folderName
`
const POST_GRAPHQL_ESSENTIAL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
  }
}
excerpt
type
`

const POST_GRAPHQL_DOWNLOAD= `
download {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
seasonsCollection {
  items {
    title
    season
    annotation
    episodes {
      json
    }
  }
}
`


async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

function extractPost(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items?.[0]
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items
}

function extractKeyValueEntries(fetchResponse) {
  return fetchResponse?.data?.keyValueCollection?.items
}

function extractPostPages(fetchResponse) {
  return fetchResponse?.data?.postCollection
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )
  return extractPost(entry)
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllPostsForHome(preview, firstPage) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}, limit: ${firstPage}) {
        skip
    		limit
    		total
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractPostPages(entries)
}

export async function getPostAndMorePosts(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
          ${POST_GRAPHQL_DOWNLOAD}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  }
}

export async function getAllKeyValue() {
  const entries = await fetchGraphQL(
    `query {
      keyValueCollection {
        items {
          key
          value
        }
      }
    }`
  )
  return extractKeyValueEntries(entries)
}

export async function getPaginatePosts(preview,skip,perPage) {
    const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}, skip: ${skip}, limit: ${perPage}) {
        skip
    		limit
    		total
        items {
          ${POST_GRAPHQL_ESSENTIAL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractPostPages(entries)
}