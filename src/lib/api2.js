import useSWR from 'swr';
import axios from 'axios';
import { getAllKeyValue } from '@lib/api'
import { APP_KEY_MASTER } from '@lib/constants'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API2_BASE_URL
//axios.defaults.baseURL = "https://home.alycante.it";


function fetcher(url) {
  return (axios.get(url).then(res => res.data));
}

export function useStatistics(url) {
  const { data, error } = useSWR(url, fetcher);
  return {
    data: data,
    isLoading: !data,
    isError: !!error
  };
}

export async function getAppParams() {

  let keyValue = {}
  const regex = /(?<=\().*?(?=\))/;   // searching between (  )
   let keyToSearch = APP_KEY_MASTER
  const data = await getAllKeyValue()
  const findKey = (el) => el.key == keyToSearch

  let keyMaster = data[data?.findIndex(findKey)]?.value ? data[data.findIndex(findKey)]?.value.split('|'):[]
  keyToSearch = []
  keyMaster.map(k => {
    const found = k.match(regex);
    if (found) {
      let key = k.substring(0,k.indexOf('('))
      found.join().split(',').map(f => {
        if (f != '') {keyToSearch.push({key: key.trim(), value: f.trim()})}
      })
    } else {
      keyToSearch.push({key: k.trim(), value: k.trim()})
    }
  })
 
  keyToSearch.map(key => {
    if (!keyValue[key.key]) {keyValue[key.key] = {}}
    data.map(d => {
      if (d.key.includes(key.value+':')) {keyValue[key.key][d.key] = d.value}
    })
   })

  return {
    firstPage: keyValue['Paging']['Paging: First page posts'] ? keyValue['Paging']['Paging: First page posts'] : 1,
    perPage: keyValue['Paging']['Paging: Post per page'] ? keyValue['Paging']['Paging: Post per page'] :  2,
    colors: keyValue['Tags'] || {},
    alert: keyValue['Alert'] || {},
    type: keyValue['Type'] || {}
  }
}