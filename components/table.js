import Link from 'next/link'
import Theader from "./theader"
import Trow from "./trow"

export default function Table({items}) {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <Theader items={items?.fields} />
        {items?.rows?.map((row,index) => (
            <Trow key={index} row={row}  index={index} />
        ))}
    </table>
  )
}

