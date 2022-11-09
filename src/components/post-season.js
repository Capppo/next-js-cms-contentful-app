import {PostBody, markdownStyles} from '@components/index'


export default function PostSeason({ content, baseUrl , userName, userToken}) {

  return (
    <div className={markdownStyles['markdown']}>
        {content?.map(season => {
          const seasonedUrl = baseUrl + '/' + 'Season '+ season.season.toString().padStart(2, '0')
          
          return (
              <div key={season.season} className="max-w-2xl mx-auto ">
                  <h3 className="text-purple-800 font-semibold">
                      Season {season.season}
                  </h3>
                  <span>{season.annotation}</span>
                  <PostBody content={season.episodes} baseUrl={seasonedUrl} userName={userName} userToken={userToken} />
              </div>
          )
        })
        }
    </div>
  )
}