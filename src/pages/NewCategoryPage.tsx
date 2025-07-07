import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar'
import { useAdmin } from '@/contexts/AdminContext';

interface FieldConfig {
  key?: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'section';
  required?: boolean;
}

interface CategoryFormData {
  title: string;
  subCategories: string;
  fields: FieldConfig[];
  image?: File | null;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'section', label: 'Section Header' }
];

const NewCategoryPage = () => {
  const navigate = useNavigate();
  const { createCategory, updateCategory } = useAdmin();

  const [formData, setFormData] = useState<CategoryFormData>({
    title: '',
    subCategories: '',
    fields: []
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newField, setNewField] = useState<FieldConfig>({
    label: '',
    type: 'text'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addField = () => {
    if (!newField.label) return;
    
    const fieldToAdd = { ...newField };
    if (fieldToAdd.type !== 'section') {
      fieldToAdd.key = fieldToAdd.label.toLowerCase().replace(/\s+/g, '_');
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, fieldToAdd]
    }));

    setNewField({
      label: '',
      type: 'text'
    });
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...formData.fields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const config = {
        fields: formData.fields
      };

      const categoryData = {
        title: formData.title,
        subCategories: formData.subCategories,
        config: JSON.stringify(config),
        image: formData.image as File
      };

      await createCategory(categoryData);
      navigate('/admin/category_management');
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Category</h1>
          <button
            onClick={() => navigate('/admin/category_management')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Categories
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subCategories">
              Subcategories (comma separated)
            </label>
            <input
              type="text"
              id="subCategories"
              name="subCategories"
              value={formData.subCategories}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
              </div>
            )}
          </div>

          <div className="mb-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Configuration</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-3">Add New Field</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    name="label"
                    value={newField.label}
                    onChange={handleFieldChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Field label (e.g. Tent Size)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={newField.type}
                    onChange={handleFieldChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fieldTypes.map(ft => (
                      <option key={ft.value} value={ft.value}>{ft.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addField}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  >
                    Add Field
                  </button>
                </div>
              </div>
              {newField.type !== 'section' && (
                <div className="mt-3 flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    name="required"
                    checked={newField.required || false}
                    onChange={handleFieldChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                    Required Field
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {formData.fields.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No fields added yet
                </div>
              ) : (
                formData.fields.map((field, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg ${field.type === 'section' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">
                          {field.label}
                        </span>
                        {field.type !== 'section' && (
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveField(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(index, 'down')}
                          disabled={index === formData.fields.length - 1}
                          className={`p-1 rounded ${index === formData.fields.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/category_management')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCategoryPage;