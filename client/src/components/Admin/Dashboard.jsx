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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageSelect = (type, file) => {
    setImages(prev => ({ ...prev, [type]: file }));
    setInvalidImages(prev => ({ ...prev, [type]: false })); // remove red border once fixed
  };

  const uploadImage = async (file, pathName) => {
    const { data, error } = await supabase.storage
      .from('products')
      .upload(`shopItemImages/${pathName}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    return supabase.storage
      .from('products')
      .getPublicUrl(`shopItemImages/${pathName}`).data.publicUrl;
  };

  const handleSubmit = async () => {
    const newInvalid = {
      main: !images.main,
      img1: !images.img1,
      img2: !images.img2,
      img3: !images.img3
    };
    setInvalidImages(newInvalid);

    const hasMissing = Object.values(newInvalid).some(Boolean);
    if (hasMissing) {
      toast.error('Please upload all images');
      return;
    }

    try {
      await toast.promise(
        (async () => {
          const timestamp = Date.now();
          const imageUrls = {};

          for (const key of Object.keys(images)) {
            if (images[key]) {
              const url = await uploadImage(
                images[key],
                `${key}-${timestamp}-${images[key].name}`
              );
              imageUrls[key] = url;
            }
          }

          const { error } = await supabase.from('products').insert([{
            title: formData.title,
            image_url: imageUrls.main || '',
            item_img_1: imageUrls.img1 || '',
            item_img_2: imageUrls.img2 || '',
            item_img_3: imageUrls.img3 || '',
            class_name: '',
            price: formData.price,
            intro: formData.intro,
            shade: formData.shade,
            finish: formData.finish,
            size: formData.size,
            color: formData.color,
            how_to_use: formData.how_to_use,
          }]);

          if (error) throw error;
        })(),
        {
          loading: 'Adding product...',
          error: 'Failed to add product',
          success: 'Product added successfully!',
        }
      );
    } catch (err) {
      console.error(err.message);
    } finally {
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
            {['Price', 'Intro', 'How to use'].map((field, idx) => (
              <div className="flex flex-col flex-1 gap-2" key={idx}>
                <label className="text-white text-base font-medium">
                  {field === 'price' ? <>Price <span className="font-semibold">GH¢</span></> : field.replace('_', ' ')}
                </label>
                {field === 'price' ? (
                  <input
                    type="text"
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-14 placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c]"
                  />
                ) : (
                  <textarea
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Write ${field.replace('_', ' ')}`}
                    className="form-input w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] min-h-20 placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c]"
                  ></textarea>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        <div>
          <h3 className="text-white text-lg font-bold mb-2 mt-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Shade', 'Finish', 'Size', 'Color'].map((field, idx) => (
              <div className="flex flex-col gap-2" key={idx}>
                <label className="text-white text-base font-medium">{field}</label>
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
            className="px-6 py-4 rounded-xl bg-[#2e1f27] cursor-pointer text-white text-lg font-bold tracking-wide hover:bg-[#a13a77] transition-colors"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;