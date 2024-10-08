"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import ImagePromptInput from "@/components/ImagePromptInput";
import GeneratedImage from "@/components/GeneratedImage";
import Gallery from "@/components/Gallery";
import { GalleryImage } from "@/types/Gallery";

const HomeView: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("image-generator")
        .list();

      if (error) throw error;

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

  const handleGenerateImage = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const fileName = `generated-${Date.now()}.png`;

      const { error } = await supabase.storage
        .from("image-generator")
        .upload(fileName, blob, {
          contentType: "image/png",
        });

      if (error) throw error;

      console.log("Image uploaded successfully!");
      fetchGallery();
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow flex flex-col">
        <ImagePromptInput
          onGenerate={handleGenerateImage}
          isGenerating={isGenerating}
        />
        <GeneratedImage imageUrl={generatedImage!} onSave={handleSaveImage} />
        <Gallery images={gallery} isLoading={isLoading} />
      </div>
    </div>
  );
};
export default HomeView;
