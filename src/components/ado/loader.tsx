import "./animations.css"

const valid = [
    "stack",
    "dot-translate",
    "factory-stack"

]

export default function Loader({ style }: {style: string}) {
    if(!valid.length) throw new Error("no animation style listed");
    // if(!valid.includes(style)) style = valid[0]
    return <>
        <div className="w-full h-full flex justify-center items-center">
            <div className={`loader-${style}`}></div>
        </div>
    </>
}