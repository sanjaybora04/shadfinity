'use client';
import { ChevronLeft, ChevronRight, Pause, Play, Settings, Square } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Dialog, DialogContent, DialogTrigger } from './dialog';

export default function PageReader() {
    const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('0');
    const [selectedSpeed, setSelectedSpeed] = useState<string>('1');
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

            return () => {
                speechSynthesis.cancel();
                speechSynthesis.onvoiceschanged = null;
            };
        } else {
            alert('Text-to-speech is not supported in this browser.');
        }
    }, [selectedVoice]);

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
    const speakLine = () => {
        if (!linesRef.current) return;

        const currentLine = linesRef.current[currentIndex];
        const text = currentLine.textContent;

        if (text) {
            utteranceRef.current.text = text.substring(currentPosition);
            speechSynthesis.speak(utteranceRef.current);

            utteranceRef.current.onboundary = (e) => {
                setCurrentPosition(e.charIndex);
            };

            utteranceRef.current.onend = () => {
                if (currentIndex < linesRef.current!.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setCurrentPosition(0);
                    highlightCurrentLine(currentIndex + 1);
                    speakLine();
                } else {
                    stop();
                }
            };
        }
    };

    // Play or pause
    const play = () => {
        if (isPlaying) {
            speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            } else {
                speakLine();
            }
            setIsPlaying(true);
        }
    };

    // Stop
    const stop = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentIndex(0);
        setCurrentPosition(0);
        highlightCurrentLine(0);
    };

    // Previous line
    const previous = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setCurrentPosition(0);
            highlightCurrentLine(currentIndex - 1);
            if (isPlaying) {
                speechSynthesis.cancel();
                speakLine();
            }
        }
    };

    // Next line
    const next = () => {
        if (linesRef.current && currentIndex < linesRef.current.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setCurrentPosition(0);
            highlightCurrentLine(currentIndex + 1);
            if (isPlaying) {
                speechSynthesis.cancel();
                speakLine();
            }
        }
    };

    // Highlight the current line
    const highlightCurrentLine = (index: number) => {
        if (linesRef.current) {
            linesRef.current.forEach((line, i) => {
                line.style.backgroundColor = i === index ? '#bae4fe' : 'transparent';
            });

            const currentLine = linesRef.current[index];
            currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div>
            <div id="page-reader-controls" className="flex max-w-fit w-max gap-4 h-10 mx-auto bg-white border shadow border-gray-600 text-gray-600 rounded-lg p-2 px-3 z-[999999]">
                <button type="button" title="Previous" onClick={previous} className="outline-none hover:scale-125">
                    <ChevronLeft />
                </button>
                <button type="button" title="Stop" onClick={stop} className={`outline-none hover:scale-125 ${isPlaying ? '' : 'hidden'}`}>
                    <Square />
                </button>
                <button type="button" title="Play/Pause" onClick={play} className="outline-none hover:scale-125">
                    {isPlaying ? <Pause /> : <Play />}
                </button>
                <button type="button" title="Next" onClick={next} className="outline-none hover:scale-125">
                    <ChevronRight />
                </button>
                <Dialog>
                    <DialogTrigger>
                        <Settings />
                    </DialogTrigger>
                    <DialogContent>
                        <div className="p-2">
                            <label htmlFor="page-reader-speed">Speed:</label>
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
                        <div className="p-2">
                            <label htmlFor="page-reader-voices">Voices:</label>
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