import Link from 'next/link'
import {Tabs} from "flowbite-react";
import Table from "./table"


export default function TabsGroup({stats,user}) {
  const userClass ="text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 "
  return (
    <>
      <div className="flex justify-between ">  
        <h3 className="text-1xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
        User activities
        </h3>
        <div className="flex flex-col">
          <h2 className={user?.properties?.color ? userClass+" text-"+user?.properties?.color:userClass}>
          {user?.name}
          </h2>

        </div>
        <img src={user?.picture} className=" w-1/6 h-1/6"></img>
      </div>
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        {stats.length > 0
        ?   <Tabs.Group aria-label="Tabs with icons" style="underline">
                {stats?.map((items,index) => (
                    <Tabs.Item key={index} title={items.title} >
                        <Table items={items.data} />
                    </Tabs.Item>
                ))}
            </Tabs.Group>
        : ''
        }
    </div>
    </>
  )
}

