"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

export default function ImageGenerator() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [gallery, setGallery] = useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("image-generator")
        .list();

      if (error) {
        throw error;
      }

      if (data) {
        const imageList = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = supabase.storage
              .from("image-generator")
              .getPublicUrl(file.name);

            return {
              name: file.name,
              url: urlData.publicUrl,
            };
          })
        );

        setGallery(imageList);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`);
      }

      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImage) {
      return;
    }
    const fileName = `${prompt}-${Date.now()}.png`;
    const base64Data = generatedImage.replace(/^data:image\/png;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    const { error } = await supabase.storage
      .from("image-generator")
      .upload(fileName, binaryData, {
        contentType: "image/png",
      });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      console.log("Image uploaded successfully!");
      fetchGallery(); // ギャラリーを更新
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter image prompt"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGenerateImage}>
          生成
        </button>
      </div>
      {generatedImage && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Generated Image:</h2>
          <div className="relative" style={{ width: "512px", height: "512px" }}>
            <Image
              src={generatedImage}
              alt="Generated"
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handleSaveImage}>
            保存
          </button>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
        {isLoading ? (
          <p>Loading gallery...</p>
        ) : gallery.length === 0 ? (
          <p>No images in the gallery yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="relative w-full aspect-square">
                <Image
                  src={image.url}
                  alt={`Gallery image ${image.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                  priority={index < 4} // Add priority to the first 4 images
                  onError={() =>
                    console.error(`Failed to load image: ${image.url}`)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
