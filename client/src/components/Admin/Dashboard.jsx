import DragAndDrop from './DragAndDrop';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    intro: '',
    how_to_use: '',
    shade: '',
    finish: '',
    size: '',
    color: ''
  });

  const [images, setImages] = useState({
    main: null,
    img1: null,
    img2: null,
    img3: null
  });

  const [invalidImages, setInvalidImages] = useState({
    main: false,
    img1: false,
    img2: false,
    img3: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageSelect = (type, file) => {
    setImages(prev => ({ ...prev, [type]: file }));
    setInvalidImages(prev => ({ ...prev, [type]: false }));
  };

  // Upload image to React app's public folder
  const uploadImageToLocal = async (file, filename) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    try {
      // Upload server running on port 3001
      const response = await fetch('http://localhost:3001/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      // Return relative URL that React can serve
      return data.url; // Returns '/img/shopItems/filename.jpg'
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const validateForm = () => {
    // Check required text fields
    const requiredFields = ['title', 'price', 'intro', 'how_to_use', 'shade', 'finish', 'size', 'color'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate price is a number
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }

    // Check images
    const newInvalid = {
      main: !images.main,
      img1: !images.img1,
      img2: !images.img2,
      img3: !images.img3
    };
    setInvalidImages(newInvalid);

    const hasMissingImages = Object.values(newInvalid).some(Boolean);
    if (hasMissingImages) {
      toast.error('Please upload all required images');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      const imageUrls = {};

      // Upload all images to local folder
      for (const [key, file] of Object.entries(images)) {
        if (file) {
          const fileExtension = file.name.split('.').pop();
          const filename = `${key}-${timestamp}.${fileExtension}`;
          
          console.log(`Uploading ${key}:`, filename);
          const url = await uploadImageToLocal(file, filename);
          imageUrls[key] = url;
          console.log(`Uploaded ${key} successfully:`, url);
        }
      }

      console.log('All images uploaded:', imageUrls);

      // Insert product data into Supabase database
      const productData = {
        title: formData.title.trim(),
        image_url: imageUrls.main || '',
        item_img_1: imageUrls.img1 || '',
        item_img_2: imageUrls.img2 || '',
        item_img_3: imageUrls.img3 || '',
        class_name: '',
        price: parseFloat(formData.price),
        intro: formData.intro.trim(),
        shade: formData.shade.trim(),
        finish: formData.finish.trim(),
        size: formData.size.trim(),
        color: formData.color.trim(),
        how_to_use: formData.how_to_use.trim(),
        created_at: new Date().toISOString(),
      };

      console.log('Inserting product data:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) {
        console.error('Database insertion error:', error);
        throw new Error(`Failed to save product: ${error.message}`);
      }

      console.log('Product inserted successfully:', data);
      toast.success('Product added successfully!');

      // Reset form
      setFormData({
        title: '',
        price: '',
        intro: '',
        how_to_use: '',
        shade: '',
        finish: '',
        size: '',
        color: ''
      });

      setImages({
        main: null,
        img1: null,
        img2: null,
        img3: null
      });

      setInvalidImages({
        main: false,
        img1: false,
        img2: false,
        img3: false
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-tr from-[#a75e5eb3] to-[#ac9f9f] flex flex-col items-center py-5 px-5 md:px-10 overflow-x-hidden"
      style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
    >
      <div className="w-full max-w-6xl bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">Add a product</h2>

        {/* Product Title */}
        <div className="flex flex-col gap-2 w-full md:w-[35%]">
          <label className="text-white text-base font-medium">Product title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-14 placeholder:text-[#be9db0] py-4 px-2 text-base focus:outline-none focus:border-[#822b5c]"
          />
        </div>

        {/* Media Section */}
        <div className="w-full h-full">
          <h3 className="text-white text-lg font-bold mb-2 mt-4">Media</h3>
          <div className="w-full">
            <div className="flex flex-col w-full md:w-[50%]">
              <label className="text-white text-base font-medium mb-2">Main image</label>
              <div className="w-full h-full mx-auto md:mx-0">
                <DragAndDrop
                  onFileSelect={(file) => handleImageSelect('main', file)}
                  isInvalid={invalidImages.main}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-2 mt-6 justify-evenly items-center">
              <div className="w-full h-auto md:h-full flex flex-col border border-[#822b5c] grow rounded-xl p-3 mb-2 bg-[#251a22]">
                <label className="text-white text-base font-medium mb-2">Image 1</label>
                <div className="w-full h-full flex items-center justify-center">
                  <DragAndDrop
                    onFileSelect={(file) => handleImageSelect('img1', file)}
                    isInvalid={invalidImages.img1}
                  />
                </div>
              </div>
              <div className="w-full h-auto md:h-full flex flex-col border border-[#822b5c] grow rounded-xl p-3 mb-2 bg-[#251a22]">
                <label className="text-white text-base font-medium mb-2">Image 2</label>
                <div className="w-full h-full flex items-center justify-center">
                  <DragAndDrop
                    onFileSelect={(file) => handleImageSelect('img2', file)}
                    isInvalid={invalidImages.img2}
                  />
                </div>
              </div>
              <div className="w-full h-auto md:h-full flex flex-col border border-[#822b5c] grow rounded-xl p-3 mb-2 bg-[#251a22]">
                <label className="text-white text-base font-medium mb-2">Image 3</label>
                <div className="w-full h-full flex items-center justify-center">
                  <DragAndDrop
                    onFileSelect={(file) => handleImageSelect('img3', file)}
                    isInvalid={invalidImages.img3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h3 className="text-white text-lg font-bold mb-2 mt-4">Details</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {[
              { name: 'price', label: 'Price', type: 'input' },
              { name: 'intro', label: 'Intro', type: 'textarea' },
              { name: 'how_to_use', label: 'How to use', type: 'textarea' }
            ].map((field, idx) => (
              <div className="flex flex-col flex-1 gap-2" key={idx}>
                <label className="text-white text-base font-medium">
                  {field.name === 'price' ? <>Price <span className="font-semibold">GH¢</span></> : field.label}
                </label>
                {field.type === 'input' ? (
                  <input
                    type="text"
                    name={field.name}
                    required
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-14 placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c]"
                  />
                ) : (
                  <textarea
                    name={field.name}
                    required
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Write ${field.label.toLowerCase()}`}
                    className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] min-h-20 placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        <div>
          <h3 className="text-white text-lg font-bold mb-2 mt-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['shade', 'finish', 'size', 'color'].map((field, idx) => (
              <div className="flex flex-col gap-2" key={idx}>
                <label className="text-white text-base font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-14 placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-4">
          <button
            className={`px-6 py-4 rounded-xl text-white text-lg font-bold tracking-wide transition-colors ${
              isSubmitting 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-[#2e1f27] cursor-pointer hover:bg-[#a13a77]'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;