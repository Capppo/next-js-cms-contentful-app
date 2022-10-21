import useSWR from 'swr';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API2_BASE_URL
//axios.defaults.baseURL = "https://home.alycante.it";

function extractRows(fetchResponse) {
  return fetchResponse.rows
}


export async function getUserStat(user) {
  const entries = await axios(
    `/stat?user=${user}`
  )
  return extractRows(entries)
}


export async function getAllStats(from) {
  const entries = await axios(
    `/stats`
  )
  
  return  extractRows(entries)
}

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