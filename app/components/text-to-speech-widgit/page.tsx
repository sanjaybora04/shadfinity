import TextToSpeech from "@/components/text-to-speech";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Shadcn Text to speech widgit",
    description: "A text to speech widgit for reading blogs and article pages"
}

export default function Page(){
    return (
        <TextToSpeech/>
    )
}