'use client';
import { ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { RadioGroup, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css'; 

type TabType = 'vqa' | 'caption' | 'detection' | 'point';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('vqa');
  const [activeWidth, setActiveWidth] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vqaRef = useRef<HTMLButtonElement>(null);
  const captionRef = useRef<HTMLButtonElement>(null);
  const detectionRef = useRef<HTMLButtonElement>(null);
  const pointRef = useRef<HTMLButtonElement>(null);

  const buttonRefs = useMemo(() => ({
    vqa: vqaRef,
    caption: captionRef,
    detection: detectionRef,
    point: pointRef,
  }), []);

  const [captionLength, setCaptionLength] = useState('short');

  useEffect(() => {
    const activeButton = buttonRefs[activeTab].current;
    if (activeButton) {
      setActiveWidth(activeButton.offsetWidth);
      setLeftPosition(activeButton.offsetLeft);
    }
  }, [buttonRefs, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !inputText.trim()) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('text', inputText);
    formData.append('type', activeTab);

    // TODO: Add your API endpoint
    console.log('Submitting:', {
      file: selectedFile,
      text: inputText,
      type: activeTab
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleExampleImageClick = async (imageSrc: string) => {
    try {
      // Fetch the image
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      // Create a File object from the blob
      const filename = imageSrc.split('/').pop() || 'image.jpg';
      const file = new File([blob], filename, { type: blob.type });
      
      // Update both the preview and the file state
      setSelectedFile(file);
      setSelectedImage(imageSrc);
      
      // Clear the file input if it exists
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error loading example image:', error);
    }
  };

  const renderInputArea = () => {
    switch (activeTab) {
      case 'vqa':
        return (
          <div>
            <textarea 
              placeholder="Ask a question about the image..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-geist text-base"
            />
            <div>
              {selectedFile && inputText.trim() && (
                <button 
                  type="submit"
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Submit"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
      case 'caption':
        return (
          <div className="flex flex-col items-start gap-2">
            <p>Caption Length</p>
            <RadioGroup.Root
              defaultValue="short"
              value={captionLength}
              onValueChange={setCaptionLength}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroup.Item value="short" id="short" />
                <label htmlFor="short">Short</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup.Item value="long" id="long" />
                <label htmlFor="long">Long</label>
              </div>
            </RadioGroup.Root>
          </div>
        );
      case 'detection':
        return (
          <div>
            <textarea 
              placeholder="Describe objects to detect..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-geist text-base"
            />
            <div>
              {selectedFile && inputText.trim() && (
                <button 
                  type="submit"
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Submit"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
      case 'point':
        return (
          <div>
            <textarea 
              placeholder="Describe what to point at..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-geist text-base"
            />
            <div>
              {selectedFile && inputText.trim() && (
                <button 
                  type="submit"
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Submit"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <Theme>
      <div className="max-w-6xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold mb-8">Playground</h1>
          
          {/* Tab buttons */}
          <div className="w-full flex justify-center">
            <div className="relative flex gap-4">
              {/* Sliding background */}
              <div 
                key={activeTab}
                className="absolute h-full bg-active_bg transition-all duration-300 ease-out rounded-sm"
                style={{
                  width: `${activeWidth}px`,
                  left: `${leftPosition}px`,
                }}
              />
              
              {/* Buttons */}
              <button 
                type="button"
                ref={buttonRefs.vqa}
                onClick={() => setActiveTab('vqa')}
                className={`px-4 py-2 rounded-sm font-medium relative transition-colors z-10 whitespace-nowrap
                  ${activeTab === 'vqa' ? '' : 'text-gray-500'}`}
              >
                VQA ⚡
              </button>
              <button 
                type="button"
                ref={buttonRefs.caption}
                onClick={() => setActiveTab('caption')}
                className={`px-4 py-2 rounded-sm font-medium relative transition-colors z-10 whitespace-nowrap
                  ${activeTab === 'caption' ? '' : 'text-gray-500'}`}
              >
                Caption 🔍
              </button>
              <button 
                type="button"
                ref={buttonRefs.detection}
                onClick={() => setActiveTab('detection')}
                className={`px-4 py-2 rounded-sm font-medium relative transition-colors z-10 whitespace-nowrap
                  ${activeTab === 'detection' ? '' : 'text-gray-500'}`}
              >
                Detection 🎯
              </button>
              <button 
                type="button"
                ref={buttonRefs.point}
                onClick={() => setActiveTab('point')}
                className={`px-4 py-2 rounded-sm font-medium relative transition-colors z-10 whitespace-nowrap
                  ${activeTab === 'point' ? '' : 'text-gray-500'}`}
              >
                Point ⭕
              </button>
            </div>
          </div>

          {/* Image and prompt area */}
          <div className="flex flex-row w-full gap-6">
            {/* Image upload area */}
            <div 
              onClick={handleImageClick} 
              className="bg-active_bg h-[225px] w-[300px] rounded-lg flex flex-shrink-0 items-center justify-center overflow-hidden relative cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt="Selected image"
                    width={300}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent opening file dialog
                      setSelectedImage(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                    aria-label="Remove image"
                  >
                    <XMarkIcon className="w-5 h-5 text-white" />
                  </button>
                </>
              ) : (
                <div className="text-center transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Add Image</p>
                </div>
              )}
            </div>

            {/* Prompt input area */}
            <div className="bg-active_bg w-full rounded-lg p-6 flex flex-col gap-4 relative">
              {renderInputArea()}
            </div>
          </div>

          {/* Example images */}
          <div className="flex gap-4 justify-center">
            {[
              { src: '/images/burger.webp', alt: 'Burger with fries' },
              { src: '/images/car.webp', alt: 'Car' },
              { src: '/images/cuttingboard.avif', alt: 'Cutting board' },
              { src: '/images/wine.webp', alt: 'Wine' },
            ].map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleImageClick(image.src)}
                className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden group transform transition-all duration-300 hover:scale-110 focus:outline-none"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover transition-all duration-300 
                    filter grayscale group-hover:grayscale-0"
                />
              </button>
            ))}
          </div>
        </form>
      </div>
    </Theme>
  );
}
