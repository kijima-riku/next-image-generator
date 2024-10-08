import React, { useState } from "react";
import Image from "next/image";
import { GalleryImage } from "@/types/Gallery";

interface GalleryProps {
  images: GalleryImage[];
  isLoading: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  return (
    <div className="flex-grow w-full bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <h2 className="text-2xl font-bold mb-2">Gallery</h2>
        {isLoading ? (
          <p>Loading gallery...</p>
        ) : images.length === 0 ? (
          <p>No images in the gallery yet.</p>
        ) : (
          <div className="overflow-x-auto whitespace-nowrap h-[30vh]">
            <div className="inline-flex space-x-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => openModal(image)}>
                  <Image
                    src={image.url}
                    alt={`Gallery image ${image.name}`}
                    width={192}
                    height={192}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}>
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <Image
              src={selectedImage.url}
              alt={`Full size ${selectedImage.name}`}
              width={800}
              height={800}
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Gallery;
