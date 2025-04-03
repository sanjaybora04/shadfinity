"use client"
import { RefreshCcw, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

type flowNode = {
    message?: string,
    options?: string[],
    inputboxDisabled?: boolean,
    validation?: ((value: any) => Promise<boolean | string> | boolean | string)
    next?: string | ((value: any) => string),
    delay?: number,
    autoNext?: boolean,
    render? : (onSubmit:any)=>React.ReactNode
}

export type configType = {
    name: string,
    image?: string,
    initialStep: string,
    tooltip?: string,
    defaultOpen?: {
        open: boolean,
        delay?: number
    },
    flow: {
        [key: string]: flowNode
    }
}

function Loader({ image }: { image: string }) {
    return (
        <div className="my-2 flex gap-2">
            <img src={image} className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex-none border border-primary" />
            <div className="p-2 bg-secondary rounded-lg flex items-center gap-1">
                <div className="w-2 h-2 rounded-lg bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-lg bg-primary animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-lg bg-primary animate-bounce delay-200"></div>
            </div>
        </div>
    )
}

function UserMessage({ msg }: { msg: any }) {
    return (
        <div className="flex justify-end my-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg whitespace-pre-line">
                {msg}
            </div>
        </div>
    )
}

function Message({ message, image }: { message: any, image: string }) {
    return (
        <div className="flex gap-2 my-2">
            <img src={image} className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex-none border border-primary" />
            <div>
                <div className="p-2 bg-secondary rounded-lg rounded-b-none whitespace-break-spaces break-all">{message}</div>
            </div>
        </div>
    )
}

function SingleChoice({ message,image,items, onClick }: { message:any,image:string,items: string[], onClick: any }) {
    const [val, setVal] = useState('')
    return (
        <>
        <div className="flex gap-2 my-2">
            <img src={image} className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex-none border border-primary" />
            <div>
                <div className="p-2 bg-secondary rounded-lg rounded-b-none whitespace-break-spaces break-all">{message}</div>
            </div>
        </div>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3">
                        {
                            items.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => {
                                        if (val == '') {
                                            onClick(item);
                                            setVal(item)
                                        }
                                    }} className="w-full">
                                        <Button className="flex w-full h-full flex-col py-2 px-2 hover:shadow-md text-wrap" variant={val == item ? 'default' : "outline"}>
                                            {item}
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </div>
            </div>
        </>
    )
}

function CustomComponent({ component, image }: { component: any, image: string }) {
    return (
        <div className="flex gap-2 my-2">
            <img src={image} className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex-none border border-primary" />
            <div>
                <div className="p-2 bg-secondary rounded-lg rounded-b-none whitespace-break-spaces break-all">{component}</div>
            </div>
        </div>
    )
}

export default function Chatbot({ config }: { config: configType }) {
    const configRef = useRef<configType>(config)
    const scrollViewportRef = useRef<any>(null)
    const lastItemRef = useRef<any>(null)
    const inputRef = useRef<any>(null)
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<any>([])
    const [input, setInput] = useState('')
    const [currentStep, setCurrentStep] = useState<string>(configRef.current.initialStep)

    async function validate(val: any, _step: string) {
        const step = configRef.current.flow[_step]
        const v = await step.validation?.(val)
        if (v == true) {
            return true
        } else if (v == false) {
            setMessages((prev: any) => ([...prev, <Message image={configRef.current.image!} message={'⚠️Invalid Input!! Try again'} key={prev.length} />]))
            return false
        } else {
            setMessages((prev: any) => ([...prev, <Message image={configRef.current.image!} message={v} key={prev.length} />]))
            return false
        }
    }

    async function onSubmit(val: any, _step: string) {
        const step = configRef.current.flow[_step]
        // validation
        if (step.validation) {
            if (await validate(val, _step) != true) {
                return
            }
        }

        // get next step
        const nextStep = (typeof step.next === 'function' ? step.next(val) : step.next) || ""

        // update messages
        setMessages((prev: any) => ([...prev, <UserMessage msg={val} key={prev.length} />]))
        addMessage(nextStep)

        // update states
        setCurrentStep(nextStep)
        setInput('')
    }

    function addMessage(_step: string) {
        const step = configRef.current.flow[_step]

        // set input disabled
        if (step.inputboxDisabled) { if (inputRef.current) inputRef.current.disabled = true }
        else { if (inputRef.current) inputRef.current.disabled = false }

        // add message
        setMessages((prev: any) => ([...prev, <Loader key={prev.length} image={configRef.current.image!} />]))
        setTimeout(() => {
            setMessages((prev: any) => {
                const m = prev.slice(0, -1);
                if(step.render){
                    m.push(<CustomComponent component={step.render((val:any)=>onSubmit(val,_step))} image={configRef.current.image!}/>)
                }else{
                    if (step.options) {
                        m.push(<SingleChoice message={step.message} image={configRef.current.image!} items={step.options!} onClick={(val: any) => onSubmit(val, _step)} key={m.length} />)
                    }
                    else if(step.message) {
                        m.push(<Message message={step.message} key={m.length} image={configRef.current.image!} />)
                    }
                }
                return [...m]
            })

            if (step.autoNext) {
                const nextStep = (typeof step.next === 'function' ? step.next('') : step.next) || ''
                setCurrentStep(nextStep);
                addMessage(nextStep)
            }
        }, step.delay)
    }

    function reload() {
        setMessages([])
        addMessage(config.initialStep)
    }

    let isMounted = false;
    useEffect(() => {
        if (!isMounted) {
            // default open state
            if (configRef.current.defaultOpen?.open) {
                setTimeout(() => setOpen(true), configRef.current.defaultOpen?.delay)
            }
            // add first message
            addMessage(currentStep)
            isMounted = true
        }
    }, [])

    useEffect(() => { configRef.current = config }, [config])

    // scroll to bottom whenever messages are updated
    useEffect(() => {
        const viewport = scrollViewportRef.current;
        const lastItem = lastItemRef.current
        if (viewport&&lastItem) {
            viewport.scrollTo({
                top: lastItem.offsetTop-viewport.offsetTop,
                behavior: "smooth", // Smooth scrolling effect
            });
        }
    }, [messages])
    return (
        <div className="fixed z-50 bottom-5 right-5 sm:bottom-10 sm:right-10">
            <div className="relative">
                <button id="chatbot-trigger" className="flex items-center gap-4" onClick={() => setOpen(true)}>
                    {configRef.current.tooltip &&
                        <div className=" bg-background p-2 shadow border rounded-xl rounded-br-none max-w-64">{configRef.current.tooltip}</div>
                    }
                    <img src={configRef.current.image} className="w-16 h-16 object-cover rounded-full border border-primary" />
                </button>
                {open &&
                    <Card className={cn("absolute right-0  bottom-0 h-[75vh] max-h-[600px] w-[calc(100vw-40px)] sm:w-96 rounded-xl p-3 flex flex-col duration-300", open && "animate-in zoom-in slide-in-from-bottom slide-in-from-right")}>
                        <div className="bg-primary text-primary-foreground h-12 w-full rounded-xl flex justify-between p-2 px-3">
                            <div className="flex gap-3 items-center">
                                <img src={configRef.current.image} className="w-8 h-8 rounded-full" />
                                {configRef.current.name}
                            </div>
                            <div className="flex gap-2">
                                <button className="hover:bg-primary-foreground hover:text-primary rounded-lg duration-300 p-1"
                                    onClick={() => reload()}
                                >
                                    <RefreshCcw />
                                </button>
                                <button className="hover:bg-primary-foreground hover:text-primary rounded-lg duration-300 p-1"
                                    onClick={() => setOpen(false)}
                                >
                                    <X />
                                </button>
                            </div>
                        </div>
                         {/* Using scroll area directly from radix ui because it doesnt pass ref to viewport by default */}
                        <ScrollAreaPrimitive.Root className="relative overflow-hidden flex-grow py-2 px-3 ">
                            <ScrollAreaPrimitive.Viewport ref={scrollViewportRef} className="h-full w-full rounded-[inherit]">
                                {messages.map((m: any, index: number) => <div ref={index===messages.length-1?lastItemRef:null} key={index}>{m}</div>)}
                            </ScrollAreaPrimitive.Viewport>
                            <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
                            <ScrollAreaPrimitive.Corner />
                        </ScrollAreaPrimitive.Root>
                        <div className="w-full">
                            <div className="flex">
                                <Input type='text' ref={inputRef} className="h-12 rounded-r-none" value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            onSubmit(input, currentStep);
                                        }
                                    }}
                                    placeholder="Type your answer..." />
                                <Button className="h-12 rounded-l-none hover:bg-primary" onClick={() => onSubmit(input, currentStep)} disabled={inputRef?.current?.disabled}>
                                    <Send />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm mt-2">
                                Built By
                                <a href="https://shadfinity.sanjaybora.in" target="_blank" className="text-blue-600 hover:underline">
                                    Shadfinity</a>
                                <img src="https://shadfinity.sanjaybora.in/favicon.ico" className="w-4 h-4" />
                            </div>
                        </div>
                    </Card>
                }
            </div>
        </div>
    )
}