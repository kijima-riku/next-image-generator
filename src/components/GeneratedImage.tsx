import React from "react";
import Image from "next/image";

interface GeneratedImageProps {
  imageUrl: string;
  onSave: () => void;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({
  imageUrl,
  onSave,
}) => (
  <div className="h-[25vh] w-full bg-gray-700 flex items-center justify-center">
    <div className="container mx-auto px-4 max-w-3xl text-center">
      {imageUrl ? (
        <>
          <div className="relative h-[20vh] w-full mb-2">
            <Image
              src={imageUrl}
              alt="Generated"
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={onSave}>
            Save to Gallery
          </button>
        </>
      ) : (
        <p>No image generated yet</p>
      )}
    </div>
  </div>
);
export default GeneratedImage;
