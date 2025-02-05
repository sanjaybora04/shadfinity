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
                                <ChatbotDemo />
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
                    <h2 className="text-3xl font-semibold mb-2 mt-10">Props</h2>
                </div>


                <table className="w-full border-collapse border border-muted-foreground">
                    <thead>
                        <tr className="bg-muted-foreground">
                            <th className="border border-muted-foreground p-2 text-left">Prop</th>
                            <th className="border border-muted-foreground p-2 text-left">Type</th>
                            <th className="border border-muted-foreground p-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-muted-foreground p-2">name</td>
                            <td className="border border-muted-foreground p-2">string</td>
                            <td className="border border-muted-foreground p-2">The chatbot's display name.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">image</td>
                            <td className="border border-muted-foreground p-2">string (URL)</td>
                            <td className="border border-muted-foreground p-2">The chatbot's avatar image.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">initialStep</td>
                            <td className="border border-muted-foreground p-2">string</td>
                            <td className="border border-muted-foreground p-2">The first step in the chatbot flow.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">tooltip</td>
                            <td className="border border-muted-foreground p-2">string</td>
                            <td className="border border-muted-foreground p-2">Tooltip text displayed with widgit.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">defaultOpen</td>
                            <td className="border border-muted-foreground p-2">boolean</td>
                            <td className="border border-muted-foreground p-2">Controls chatbot's initial visibility.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">flow</td>
                            <td className="border border-muted-foreground p-2">FlowNode[]</td>
                            <td className="border border-muted-foreground p-2">Defines chatbot conversation logic.</td>
                        </tr>
                    </tbody>
                </table>

                <h2 className="text-xl font-bold mt-6">FlowNode</h2>
                <p className="mt-2">Each flow node in the chatbot has the following properties:</p>

                <table className="w-full border-collapse border border-muted-foreground mt-4">
                    <thead>
                        <tr className="bg-muted-foreground">
                            <th className="border border-muted-foreground p-2 text-left">Property</th>
                            <th className="border border-muted-foreground p-2 text-left">Type</th>
                            <th className="border border-muted-foreground p-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-muted-foreground p-2">delay</td>
                            <td className="border border-muted-foreground p-2">number (ms)</td>
                            <td className="border border-muted-foreground p-2">Delay before showing the message.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">message</td>
                            <td className="border border-muted-foreground p-2">string</td>
                            <td className="border border-muted-foreground p-2">The message displayed to the user.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">options</td>
                            <td className="border border-muted-foreground p-2">string[]</td>
                            <td className="border border-muted-foreground p-2">List of selectable responses.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">inputboxDisabled</td>
                            <td className="border border-muted-foreground p-2">boolean</td>
                            <td className="border border-muted-foreground p-2">Disables the input field.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">validation</td>
                            <td className="border border-muted-foreground p-2">function</td>
                            <td className="border border-muted-foreground p-2">Function to validate user input. Must return a boolean or string.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">next</td>
                            <td className="border border-muted-foreground p-2">string | function</td>
                            <td className="border border-muted-foreground p-2">Defines the next step in flow. Can be a string or a function that determines the next step based on input.</td>
                        </tr>
                        <tr>
                            <td className="border border-muted-foreground p-2">autoNext</td>
                            <td className="border border-muted-foreground p-2">boolean</td>
                            <td className="border border-muted-foreground p-2">Automatically moves to next step after displaying the message.</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    )
}