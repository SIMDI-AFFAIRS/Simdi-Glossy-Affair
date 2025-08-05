import { useState } from "react";

const DragAndDrop = ({ onFileSelect, isInvalid = false }) => {
  const [droppedFile, setDroppedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    setDroppedFile(file);
    if (onFileSelect) onFileSelect(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <form
      className={`w-full transition-all duration-100 shadow border rounded-2xl p-4 text-center font-[Montserrat]
        ${dragActive ? 'bg-black/50' : 'bg-white/80'}
        ${isInvalid ? 'border-red-500 animate-[wiggle_0.2s_ease-in-out]' : 'border-gray-600 shadow-[#7b7e85]'}
      `}
    >
      <h2 className={`${dragActive ? 'text-white' : 'text-black'} text-2xl font-medium`}>
        Upload Image
      </h2>
      <p className="mt-2 text-sm text-gray-600">Supported: drag or select</p>

      <label
        htmlFor="file-input"
        className={`mt-4 transition-all duration-100 flex flex-col justify-center items-center p-4 border-2 border-dashed rounded-xl text-gray-700 cursor-pointer
          ${dragActive ? 'bg-black/40' : 'bg-white'}
          hover:bg-blue-100 hover:border-gray-700
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <span className="text-lg font-bold transition-colors">Drop files here</span>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="mt-4 w-full text-gray-700 bg-white border border-gray-300 rounded-lg
            file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:rounded-lg file:cursor-pointer
            hover:file:bg-blue-800
          "
          onChange={handleFileChange}
        />
      </label>

      {previewUrl && (
        <div className="mt-2 flex justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow"
          />
        </div>
      )}
    </form>
  );
};

export default DragAndDrop;
