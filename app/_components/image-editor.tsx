// app/_components/image-editor.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react"; // Importing icons

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const lines: string[] = [];
  let currentLine = "";

  const paragraphs = text.split("\n");
  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(" ");
    currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const { width } = ctx.measureText(currentLine + " " + word);
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    currentLine = "";
  });

  return lines;
};

export const ImageEditor = ({
  onImageProcessed,
  index,
}: {
  onImageProcessed: (dataUrl: string) => void;
  index?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(30); // Default font size

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          if (text) {
            const padding = 20;
            const maxWidth = canvas.width - padding * 2;
            const lineHeight = fontSize * 1.4;

            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 8;

            const lines = wrapText(ctx, text, maxWidth);
            const startY =
              canvas.height * 0.65 - (lines.length * lineHeight) / 2;

            ctx.fillStyle = "white";
            lines.forEach((line, i) => {
              ctx.fillText(
                line,
                canvas.width / 2,
                startY + i * lineHeight,
                maxWidth
              );
            });
          }

          onImageProcessed(canvas.toDataURL("image/jpeg"));
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(image);
    }
  }, [image, text, fontSize]); // Added fontSize as a dependency

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-6 px-4">
      <div className="w-full max-w-[600px] space-y-4">
        <div className="relative aspect-square w-full bg-muted rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
          {!image && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Preview will appear here
            </div>
          )}
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor={`image-${index}`} className="text-lg font-medium">
            Upload Image
          </Label>
          <Input
            id={`image-${index}`}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full h-12 border-2 border-dashed"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor={`text-${index}`} className="text-lg font-medium">
            Caption Text
          </Label>
          <Textarea
            id={`text-${index}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your caption (press Enter for new line)"
            rows={4}
            className="min-h-[120px] text-lg border-2 rounded-xl p-4"
          />
          <p className="text-sm text-muted-foreground">
            Tip: Press Enter for manual line breaks. Text wraps automatically.
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFontSize((prev) => Math.min(prev + 2, 100))}
          className="px-4 py-2 bg-slate-200 text-black rounded-md flex items-center"
        >
          <Plus className="mr-2" /> {/* Increase Font Size Icon */}
          Increase Font Size
        </button>
        <button
          onClick={() => setFontSize((prev) => Math.max(prev - 2, 10))}
          className="px-4 py-2 bg-slate-200 text-black rounded-md flex items-center"
        >
          <Minus className="mr-2" /> {/* Decrease Font Size Icon */}
          Decrease Font Size
        </button>
      </div>
    </div>
  );
};
