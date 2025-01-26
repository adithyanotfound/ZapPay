import React from "react"
//for centering any react ke elements we provide,h-full imp, 2 flex
export const Center = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex justify-center flex-col h-full">
        <div className="flex justify-center">
            {children}
        </div>
    </div>
}