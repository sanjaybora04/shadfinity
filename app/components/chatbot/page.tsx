'use client'
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, Bot, Copy } from "lucide-react";
import { CodeBlock, dracula } from 'react-code-blocks'
import chatbot from '@/public/r/chatbot.json'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import ChatbotDemo from "@/components/chatbot";

export default function Page() {
    const [preview, setPreview] = useState(true)
    return (
        <div className="p-4 mx-auto max-w-2xl w-full">
            <div className="flex flex-col gap-1 py-10">
                <h1 className="text-3xl font-bold tracking-tight flex gap-2 items-center"><Bot className="w-8 h-8" />Chatbot</h1>
                <p className="text-muted-foreground">
                    A simple chatbot component with customisable flow.
                </p>
            </div>

            <div className="flex flex-col flex-1 gap-4">
                <div className="border-b">
                    <Button variant='ghost' className={preview ? "border-b-2 border-primary" : ''} onClick={() => setPreview(true)}>Preview</Button>
                    <Button variant='ghost' className={preview ? "" : "border-b-2 border-primary"} onClick={() => setPreview(false)}>Code</Button>
                </div>
                <ScrollArea className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative max-h-[400px]">
                    {preview ?
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground sm:pl-3">
                                    A chatbot component with customisable flow
                                </p>
                                <OpenInV0Button name="chatbot" className="w-fit" />
                            </div>
                            <div className="flex items-center justify-center min-h-[400px] relative">
                                <Button>See below<ArrowDownRight /></Button>
                                <ChatbotDemo/>
                            </div>
                        </> :
                        <>
                            <Button size='icon' variant='outline' className="absolute top-7 right-7"
                                onClick={() => {
                                    navigator.clipboard.writeText(chatbot.files[0].content)
                                    toast.success('Copied')
                                }}
                            ><Copy /></Button>
                            <CodeBlock
                                language="jsx"
                                text={chatbot.files[0].content}
                                theme={dracula}
                                showLineNumbers={false}
                            />
                        </>
                    }

                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>

            <div className="flex flex-col flex-1 gap-4">
                <div className="border-b">
                    <h2 className="text-3xl font-semibold mb-2 mt-10">Installation</h2>
                </div>

                <div className="relative">
                    <Button size='icon' variant='outline' className="absolute top-1 right-1"
                        onClick={() => {
                            navigator.clipboard.writeText(`npx shadcn@latest add ${process.env.NEXT_PUBLIC_SITE_URL}/registry/chatbot.json`)
                            toast.success('Copied')
                        }}
                    ><Copy /></Button>
                    <CodeBlock
                        language="jsx"
                        text={`npx shadcn@latest add ${process.env.NEXT_PUBLIC_SITE_URL}/registry/chatbot.json`}
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </div>

            </div>

            <div className="flex flex-col flex-1 gap-4">
                <div className="border-b">
                    <h2 className="text-3xl font-semibold mb-2 mt-10">Usage</h2>
                </div>

                

            </div>
        </div>
    )
}