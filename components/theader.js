import Link from 'next/link'


export default function Theader({items}) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
       { 
             items?.map((item) => (
                <th key={item.name} scope="col" className="py-3 px-6">
                    {item.name}
                </th>
             ))
        }
        </tr>
    </thead>
  )
}
