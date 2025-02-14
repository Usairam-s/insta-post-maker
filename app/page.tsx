// app/page.tsx
"use client";
import { useState } from "react";
import { ImageEditor } from "./_components/image-editor";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [postType, setPostType] = useState<"single" | "double" | null>(null);
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.download = `instagram-post-${index + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="min-h-screen w-full">
      <div className="container h-full px-4 py-8">
        {!postType ? (
          <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Instagram Post Maker
              </h1>
              <p className="text-muted-foreground mx-auto max-w-prose text-lg">
                Create stunning Instagram posts with perfect sizing and text
                overlay. Choose between single or double post layouts.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => setPostType("single")}
                className="h-14 px-8 text-lg"
              >
                Single Post
              </Button>
              <Button
                size="lg"
                onClick={() => setPostType("double")}
                className="h-14 px-8 text-lg"
                variant="secondary"
              >
                Two Posts
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8">
            <Button
              variant="outline"
              onClick={() => setPostType(null)}
              className="mb-8 ml-4 sm:ml-0"
            >
              ← Back to Selection
            </Button>

            <div
              className={`grid gap-8 ${
                postType === "double" ? "md:grid-cols-2" : ""
              }`}
            >
              {Array.from({ length: postType === "single" ? 1 : 2 }).map(
                (_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="rounded-xl border bg-background p-4 shadow-sm">
                      <ImageEditor
                        index={i}
                        onImageProcessed={(dataUrl) => {
                          const newImages = [...processedImages];
                          newImages[i] = dataUrl;
                          setProcessedImages(newImages);
                        }}
                      />
                    </div>

                    {processedImages[i] && (
                      <Button
                        onClick={() => handleDownload(processedImages[i], i)}
                        className="w-full py-6 text-lg"
                        size="lg"
                      >
                        Download Post {i + 1}
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
