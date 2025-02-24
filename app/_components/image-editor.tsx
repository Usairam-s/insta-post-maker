"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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

const FONT_SIZES = [
  { value: "75", label: "Small" },
  { value: "90", label: "Medium" },
  { value: "120", label: "Large" },
];

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
  const [fontSize, setFontSize] = useState(30);
  const [shadowOpacity, setShadowOpacity] = useState(0.3); // New State for Shadow

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

          // Apply shadow overlay with adjustable opacity
          ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
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

            // Check if text fits vertically
            const availableHeight = canvas.height * 0.35;
            const neededHeight = lines.length * lineHeight;

            if (neededHeight > availableHeight) {
              ctx.fillStyle = "red";
              ctx.fillText(
                "Text too long!",
                canvas.width / 2,
                canvas.height / 2,
                maxWidth
              );
            } else {
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
          }

          onImageProcessed(canvas.toDataURL("image/jpeg"));
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(image);
    }
  }, [image, text, fontSize, shadowOpacity]); // Re-render on opacity change

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

        {/* Shadow Opacity Slider */}
        <div className="space-y-2 w-full">
          <Label className="text-lg font-medium">Shadow Opacity</Label>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={[shadowOpacity]}
            onValueChange={(value: any) => setShadowOpacity(value[0])}
          />
          <p className="text-sm text-muted-foreground">
            Adjust the background shadow intensity
          </p>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-2 w-full">
          <Label className="text-lg font-medium">Font Size</Label>
          <Select
            value={fontSize.toString()}
            onValueChange={(value) => setFontSize(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Font Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">
            Choose size that fits your text in the preview
          </p>
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
    </div>
  );
};
