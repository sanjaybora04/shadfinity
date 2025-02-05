"use client"
import { RefreshCcw, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type flowNode = {
    message?: string,
    options?: string[],
    inputboxDisabled?: boolean,
    validation?: ((value: any) => Promise<boolean | string> | boolean | string)
    next?: string | ((value: any) => string),
    delay?: number,
    autoNext?: boolean
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

function Loader({image}:{image?:string}) {
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

function Message({ message,image }: { message: any,image?:string }) {
    return (
        <div className="flex gap-2 my-2">
            <img src={image} className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex-none border border-primary" />
            <div>
                <div className="p-2 bg-secondary rounded-lg rounded-b-none whitespace-break-spaces">{message}</div>
            </div>
        </div>
    )
}

function SingleChoice({ items, onClick }: { items: string[], onClick: any }) {
    const [formopen, setFormOpen] = useState(true)
    const [val, setVal] = useState('')
    return (
        <>
            <div className="flex flex-col gap-2">
                {
                    formopen && <div className="grid grid-cols-2 gap-3">
                        {
                            items.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => {
                                        if (val == '') {
                                            onClick(item);
                                            setVal(item)
                                        }
                                    }} className="w-full">
                                        <Button className="flex w-full h-full flex-col py-2 px-2 hover:shadow-md" variant={val == item ? 'default' : "outline"}>
                                            {item}
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default function Chatbot({ config }: { config: configType }) {
    const configRef = useRef<configType>(config)
    const scrollViewportRef = useRef<any>(null)
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
            setMessages((prev: any) => ([...prev, <Message message={'⚠️Invalid Input!! Try again'} key={prev.length} />]))
            return false
        } else {
            setMessages((prev: any) => ([...prev, <Message message={v} key={prev.length} />]))
            return false
        }
    }

    async function onInput(val: any, _step: string) {
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
        if (step.inputboxDisabled) { if(inputRef.current)inputRef.current.disabled = true }
        else { if(inputRef.current)inputRef.current.disabled = false }

        // add message
        setMessages((prev: any) => ([...prev, <Loader key={prev.length} image={configRef.current.image} />]))
        setTimeout(() => {
            setMessages((prev: any) => {
                const m = prev.slice(0, -1);
                if (step.message) {
                    m.push(<Message message={step.message} key={m.length} image={configRef.current.image} />)
                }
                if (step.options) {
                    m.push(<SingleChoice items={step.options!} onClick={(val: any) => onInput(val, _step)} key={m.length} />)
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
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: "smooth", // Smooth scrolling effect
            });
        }
    }, [messages])
    return (
        <div className="fixed z-50 bottom-5 right-5 sm:bottom-10 sm:right-10">
            <div className="relative">
                <button className="flex items-center gap-4" onClick={() => setOpen(true)}>
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
                        <ScrollArea ref={scrollViewportRef} className="flex-grow py-2 px-3">
                            {messages.map((m: any, index: number) => <div key={index}>{m}</div>)}
                        </ScrollArea>
                        <div className="w-full">
                            <div className="flex">
                                <Input type='text' ref={inputRef} className="h-12 rounded-r-none" value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            onInput(input, currentStep);
                                        }
                                    }}
                                    placeholder="Type your answer..." />
                                <Button className="h-12 rounded-l-none hover:bg-primary" onClick={() => onInput(input, currentStep)} disabled={inputRef?.current?.disabled}>
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