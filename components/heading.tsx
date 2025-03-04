"use client"

interface HeadingProps {
    title: string,
    description: string
}



export const Heading = ({title, description}: HeadingProps) => {
  return (
    <div className="w-full flex justify-center flex-col items-center">
        <h2 style={{ color: '#636af7' }}   className="tracking-tight font-bold text-base sm:text-lg md:text-xl lg:text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
 