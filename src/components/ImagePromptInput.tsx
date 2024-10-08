import React, { useState } from "react";

interface ImagePromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const ImagePromptInput: React.FC<ImagePromptInputProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <div className="h-[15vh] w-full bg-gray-800 flex items-center">
      <form
        onSubmit={handleSubmit}
        className="container mx-auto px-4 max-w-3xl">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white text-center placeholder-gray-400 placeholder-opacity-75"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Enter image prompt"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
};

export default ImagePromptInput;
