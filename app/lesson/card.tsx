"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: "SELECT" | "ASSIST" | "IELTS_READING" | "IELTS_WRITING" | "IELTS_LISTENING" | "IELTS_SPEAKING" | "IELTS_TFNG";
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  text,
  shortcut,
  selected,
  onClick,
  disabled,
  status,
  type,
}: Props) => {
  /**
   * FIX: We pass the audioSrc (or empty string) to useAudio.
   * react-use needs the returned [audio] element to be rendered 
   * regardless of whether the src is valid to avoid the "ref is empty" error.
   */
  const [audio, _state, controls] = useAudio({
    src: audioSrc || "",
  });

  const handleClick = useCallback(() => {
    if (disabled) return;

    // Only attempt to play if we actually have an audio source
    if (audioSrc) {
      controls.play();
    }
    
    onClick();
  }, [disabled, onClick, controls, audioSrc]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "bg-sky-100 border-sky-300 hover:bg-sky-100",
        selected && status === "correct" && "border-green-300 bg-green-100",
        selected && status === "wrong" && "border-rose-300 bg-rose-100",
        disabled && "pointer-events-none opacity-50",
        type === "ASSIST" && "lg:p-3 w-full"
      )}
    >
      {/* 
         FIX: Always render the audio element. 
         If audioSrc is null, it renders an empty <audio> tag which satisfies useAudio() 
         without triggering the "empty string src" warning from the previous error.
      */}
      {audio}
      
      {imageSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}
      <div
        className={cn(
          "flex items-center justify-between",
          type === "ASSIST" && "flex-row-reverse"
        )}
      >
        {type === "ASSIST" && <div />}
        <p
          className={cn(
            "text-neutral-600 text-sm lg:text-base",
            selected && "text-sky-500",
            selected && status === "correct" && "text-green-500",
            selected && status === "wrong" && "text-rose-500"
          )}
        >
          {text}
        </p>
        <div
          className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-[12px] font-semibold",
            selected && "border-sky-300 text-sky-500",
            selected && status === "correct" && "border-green-500 text-green-500",
            selected && status === "wrong" && "border-rose-500 text-rose-500"
          )}
        >
          {shortcut}
        </div>
      </div>
    </div>
  );
};
