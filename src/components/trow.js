import Link from 'next/link'



export default function Trow({row, index}) {
    let items = []
    for (const [key, value] of Object.entries(row)) {
        items.push({key: key, value: value})
        }

  return (
    <tbody>
        <tr key={index}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        { 
            items.map((item) => (
                <td key={index+item.key} className="py-2 px-3">
                    {item?.value?.length > 20
                    ? item.value.substring(item.value.lastIndexOf("/")+1)
                    : item.value 
                    }
                </td>
             ))
        }
        </tr>
    </tbody>
  )
}

