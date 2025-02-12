import TTSWidgit from "@/components/ui/tts-widgit";

export default function TTS() {
    return (
        <div className="flex flex-col items-center gap-3">

            <TTSWidgit />
            <div id="content" className="px-3">
                <p>This is a text to speech widgit. To use it follow the following instructions:-</p>
                <div className="">
                    <ul className="list-disc pl-5 space-y-2 mt-3">
                        <li>
                            <p>Wrap your content in a container with id "#content".</p>
                        </li>
                        <li>
                            <p>The content you want to be read should be inside either a heading tag or a paragraph tag.</p>
                        </li>
                        <li>
                            <p>Now add text-to-speech-widgit anywhere in your page.</p>
                        </li>
                        <li>
                            <p>It will automatically detect all the content in your page and read the lines one by one.</p>
                        </li>
                    </ul>
                </div>
                <p></p>
            </div>
        </div>
    )
}