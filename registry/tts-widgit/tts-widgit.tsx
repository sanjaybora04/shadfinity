'use client';
import { Pause, Play, Settings, SkipBack, SkipForward, Square } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function TextToSpeechWidgit() {
    const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('0');
    const [selectedSpeed, setSelectedSpeed] = useState<string>('1');
    const [isActive, setIsActive] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentPosition, setCurrentPosition] = useState<number>(0);

    const linesRef = useRef<NodeListOf<HTMLElement>>(null);
    const utteranceRef = useRef(new SpeechSynthesisUtterance());

    // Initialize voices and lines
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const populateVoices = () => {
                const voices = speechSynthesis.getVoices();
                setVoices(voices);
                if (voices.length > 0) {
                    utteranceRef.current.voice = voices[parseInt(selectedVoice)];
                }
            };

            populateVoices();
            speechSynthesis.onvoiceschanged = populateVoices;

            const selector = allowedTags.map((tag) => `#content ${tag}`).join(', ');
            linesRef.current = document.querySelectorAll(selector);

            utteranceRef.current.addEventListener('boundary', (e) => {
                setCurrentPosition(e.charIndex);
            });

            return () => {
                utteranceRef.current.removeEventListener('boundary', function (e) {
                    setCurrentPosition(e.charIndex);
                  });
                speechSynthesis.cancel();
                speechSynthesis.onvoiceschanged = null;
            };
        } else {
            alert('Text-to-speech is not supported in this browser.');
        }
    }, []);

    // Handle voice change
    useEffect(() => {
        if (voices.length > 0) {
            utteranceRef.current.voice = voices[parseInt(selectedVoice)];
        }
    }, [selectedVoice, voices]);

    // Handle speed change
    useEffect(() => {
        utteranceRef.current.rate = parseFloat(selectedSpeed);
    }, [selectedSpeed]);

    // Speak the current line
    const speakLine = (index:number,position:number) => {
        if (!linesRef.current) return;

        const currentLine = linesRef.current[index];
        const text = currentLine.textContent;

        if (text) {
            utteranceRef.current.text = text.substring(position);
            speechSynthesis.speak(utteranceRef.current);

            utteranceRef.current.onend = () => {
                if (index < linesRef.current!.length - 2) {
                    setCurrentIndex((prev) => prev + 1);
                    setCurrentPosition(0);
                    highlightLine(index + 1);
                    speakLine(index+1,0);
                } else {
                    stop();
                }
            };
        }
    };

    // Play or pause
    const play = () => {
        setIsActive(true)

        highlightLine(currentIndex)
        
        if (isPlaying) {
            speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            } else {
                speakLine(currentIndex,currentPosition);
            }
            setIsPlaying(true);
        }
    };

    // Stop
    const stop = () => {
        speechSynthesis.cancel();
        setIsActive(false);
        setIsPlaying(false);
        setCurrentIndex(0);
        setCurrentPosition(0);
        highlightLine(-1);
    };

    // Previous line
    const previous = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setCurrentPosition(0);
            highlightLine(currentIndex - 1);
            if (isPlaying) {
                speechSynthesis.cancel();
                speakLine(currentIndex-1,0);
            }
        }
    };

    // Next line
    const next = () => {
        if (linesRef.current && currentIndex < linesRef.current.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setCurrentPosition(0);
            highlightLine(currentIndex + 1);
            if (isPlaying) {
                speechSynthesis.cancel();
                speakLine(currentIndex+1,0);
            }
        }
    };

    // Highlight the current line
    const highlightLine = (index: number) => {
        if (linesRef.current) {
            linesRef.current.forEach((line, i) => {
                line.style.backgroundColor = i === index ? '#78accc' : 'transparent';
            });

            const currentLine = linesRef.current[index];
            currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div>
            <div className={cn("flex gap-3 bg-gray-700 border rounded text-white p-2 w-fit",isActive?"fixed z-50 bottom-2 left-1/2 -translate-x-1/2":"")}>
                <button type="button" title="Previous" onClick={()=>previous()} className="outline-none hover:scale-125">
                    <SkipBack className='fill-current' />
                </button>
                <button type="button" title="Stop" onClick={()=>stop()} className={`outline-none hover:scale-125 ${isPlaying ? '' : 'hidden'}`}>
                    <Square className='fill-current' />
                </button>
                <button type="button" title="Play/Pause" onClick={()=>play()} className="outline-none hover:scale-125">
                    {isPlaying ? <Pause className='fill-current' /> : <Play className='fill-current' />}
                </button>
                <button type="button" title="Next" onClick={()=>next()} className="outline-none hover:scale-125">
                    <SkipForward className='fill-current' />
                </button>
                <Dialog>
                    <DialogTrigger className='hover:scale-125'>
                        <Settings />
                    </DialogTrigger>
                    <DialogContent>
                        <div>
                            <div className='mb-2'>Speed:</div>
                            <Select value={selectedSpeed} onValueChange={setSelectedSpeed}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0.5">0.5x</SelectItem>
                                    <SelectItem value="1">1x</SelectItem>
                                    <SelectItem value="1.5">1.5x</SelectItem>
                                    <SelectItem value="2">2x</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div className='mb-2'>Voices:</div>
                            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {voices.map((voice, index) => (
                                        <SelectItem key={index} value={`${index}`}>
                                            {voice.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}