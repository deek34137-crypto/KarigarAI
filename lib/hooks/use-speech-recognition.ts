"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionHookOptions {
  lang?: string;
  continuous?: boolean;
}

export function useSpeechRecognition({
  lang = "hi-IN",
  continuous = true,
}: SpeechRecognitionHookOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("[SpeechRecognition Error]:", event.error);
          if (event.error !== "no-speech") {
            setError(event.error);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors on unmount
        }
      }
    };
  }, [lang, continuous]);

  const startListening = useCallback(() => {
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition already running or error:", err);
      }
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
