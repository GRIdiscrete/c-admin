"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
    data: any[];
}

const Overview = ({data}: OverviewProps) => {
    return(
        <ResponsiveContainer width={"100%"} height={350}>
            <BarChart data={data} >
                <XAxis
                dataKey={"name"}
                stroke="#555"
                fontSize={12}
                tickLine={false}
                axisLine={false}/>
                <YAxis 
                tickFormatter={(v)=>`$${v}`}
                stroke="#555"
                fontSize={12}
                tickLine={false}
                axisLine={false}/>

                <Bar dataKey={"total"} fill="#636af7" radius={[4,4,0,0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default Overview;