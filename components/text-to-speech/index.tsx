'use client'
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { CodeBlock, dracula } from 'react-code-blocks'
import texttospeechwidgit from '@/public/r/text-to-speech-widgit.json'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import TTSWidgit from "../ui/tts-widgit";
import TTS from "./tts";

export default function Page() {
    const [preview, setPreview] = useState(true)
    return (
        <div className="p-4 mx-auto max-w-2xl w-full min-w-0">
            <div className="flex flex-col gap-1 py-10">
                <h1 className="text-3xl font-bold tracking-tight flex gap-2 items-center">Text to speech widgit</h1>
                <p className="text-muted-foreground">
                    Text to speech widgit for blog and article pages
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
                                    Text to speech widgit for blog and article pages
                                </p>
                                <OpenInV0Button name="text-to-speech-widgit" className="w-fit" />
                            </div>
                            <div className="flex items-center justify-center min-h-[400px] relative">
                                <TTS/>
                            </div>
                        </> :
                        <>
                            <Button size='icon' variant='outline' className="absolute top-7 right-7"
                                onClick={() => {
                                    navigator.clipboard.writeText(texttospeechwidgit.files[0].content)
                                    toast.success('Copied')
                                }}
                            ><Copy /></Button>
                            <CodeBlock
                                language="jsx"
                                text={texttospeechwidgit.files[0].content}
                                theme={dracula}
                                showLineNumbers={false}
                            />
                        </>
                    }

                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>

            <div className="flex flex-col flex-1 gap-4 w-full">
                <div className="border-b">
                    <h2 className="text-3xl font-semibold mb-2 mt-10">Installation</h2>
                </div>

                <ScrollArea className="relative">
                    <Button size='icon' variant='outline' className="absolute top-1 right-1"
                        onClick={() => {
                            navigator.clipboard.writeText(`npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/registry/text-to-speech-widgit.json`)
                            toast.success('Copied')
                        }}
                    ><Copy /></Button>
                    <CodeBlock
                        language="jsx"
                        text={`npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/registry/text-to-speech-widgit.json`}
                        theme={dracula}
                        showLineNumbers={false}

                    />
                    <ScrollBar orientation="horizontal" className="bg-black" />
                </ScrollArea>
            </div>

            <div className="flex flex-col flex-1 gap-4 mb-44">
                <div className="border-b">
                    <h2 className="text-3xl font-semibold mb-2 mt-10">Examples</h2>
                </div>

                <ul className="list-disc pl-5">
                    <li><a className="underline" href="https://sanjaybora.in/blog/building-a-web3-voting-app-step-by-step-from-smart-contracts-to-frontend-integration">https://sanjaybora.in/blog/building-a-web3-voting-app-step-by-step-from-smart-contracts-to-frontend-integration</a></li>
                </ul>


            </div>
        </div>
    )
}