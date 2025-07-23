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
  { value: 'boolean', label: 'Checkbox' }
];

const NewCategoryPage = () => {
  const navigate = useNavigate();
  const { createCategory, updateCategory } = useAdmin();
  const [selectedSection, setSelectedSection] = useState<string>(''); // Add this with other state declarations

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
  const [newSectionName, setNewSectionName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // Add this helper function
  const getAvailableSections = () => {
    return formData.fields
      .filter(field => field.type === 'section')
      .map((field, index) => ({
        value: field.label,
        label: field.label,
        index: formData.fields.findIndex(f => f === field)
      }));
  };

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

  const addSection = () => {
    if (!newSectionName.trim()) return;

    const sectionField: FieldConfig = {
      label: newSectionName.trim(),
      type: 'section'
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, sectionField]
    }));

    setNewSectionName('');
  };
  const addField = () => {
    if (!newField.label) return;

    const fieldToAdd = { ...newField };
    fieldToAdd.key = fieldToAdd.label.toLowerCase().replace(/\s+/g, '_');

    // If no section is selected, add to the end
    if (!selectedSection) {
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, fieldToAdd]
      }));
    } else {
      // Find the selected section and add the field after it
      const sectionIndex = formData.fields.findIndex(
        field => field.type === 'section' && field.label === selectedSection
      );

      if (sectionIndex !== -1) {
        // Find the next section or end of array
        let insertIndex = sectionIndex + 1;

        // Find all fields that belong to the current section
        for (let i = sectionIndex + 1; i < formData.fields.length; i++) {
          if (formData.fields[i].type === 'section') {
            break;
          }
          insertIndex = i + 1;
        }

        const newFields = [...formData.fields];
        newFields.splice(insertIndex, 0, fieldToAdd);

        setFormData(prev => ({
          ...prev,
          fields: newFields
        }));
      } else {
        // If section not found, add to end
        setFormData(prev => ({
          ...prev,
          fields: [...prev.fields, fieldToAdd]
        }));
      }
    }

    setNewField({
      label: '',
      type: 'text'
    });
    setSelectedSection(''); // Reset section selection
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const duplicateField = (index: number) => {
    const fieldToDuplicate = { ...formData.fields[index] };
    if (fieldToDuplicate.key) {
      fieldToDuplicate.key = `${fieldToDuplicate.key}_copy`;
    }
    fieldToDuplicate.label = `${fieldToDuplicate.label} (Copy)`;

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields.slice(0, index + 1), fieldToDuplicate, ...prev.fields.slice(index + 1)]
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newFields = [...formData.fields];
    const draggedField = newFields[draggedIndex];

    newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);

    setFormData(prev => ({ ...prev, fields: newFields }));
    setDraggedIndex(null);
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

  const groupedFields = () => {
    const groups: { section: FieldConfig | null; fields: { field: FieldConfig; index: number }[] }[] = [];
    let currentGroup: { section: FieldConfig | null; fields: { field: FieldConfig; index: number }[] } = {
      section: null,
      fields: []
    };

    formData.fields.forEach((field, index) => {
      if (field.type === 'section') {
        if (currentGroup.section || currentGroup.fields.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = { section: field, fields: [] };
      } else {
        currentGroup.fields.push({ field, index });
      }
    });

    if (currentGroup.section || currentGroup.fields.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
            <p className="text-gray-600 mt-2">Define your category structure and custom fields</p>
          </div>
          <button
            onClick={() => navigate('/admin/category_management')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            ← Back to Categories
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                  Category Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Camping Equipment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subCategories">
                  Subcategories
                </label>
                <input
                  type="text"
                  id="subCategories"
                  name="subCategories"
                  value={formData.subCategories}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tents, Backpacks, Sleeping Bags"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple subcategories with commas</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="flex-shrink-0">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Field Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Form Fields Configuration</h2>

            {/* Add Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-3">Add Section Header</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Section name (e.g., Product Details)"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>

            {/* Add Field */}
            {/* Add Field */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-3">Add Form Field</h3>

              {/* Field Label and Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-800 mb-1">Field Label</label>
                  <input
                    type="text"
                    name="label"
                    value={newField.label}
                    onChange={handleFieldChange}
                    placeholder="Field label (e.g., Product Name)"
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Field Type</label>
                  <select
                    name="type"
                    value={newField.type}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {fieldTypes.map(ft => (
                      <option key={ft.value} value={ft.value}>{ft.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">Add To Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">End of form</option>
                    {getAvailableSections().map(section => (
                      <option key={section.index} value={section.value}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Required checkbox and Add button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    name="required"
                    checked={newField.required || false}
                    onChange={handleFieldChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 block text-sm text-green-700">
                    Required Field
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addField}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Field
                </button>
              </div>

              {/* Help text */}
              <div className="mt-3 text-sm text-green-600">
                {selectedSection ? (
                  <span>Field will be added to the "{selectedSection}" section</span>
                ) : (
                  <span>Field will be added to the end of the form</span>
                )}
              </div>
            </div>

            {/* Field Preview */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-800 mb-4">Form Preview</h3>

              {formData.fields.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 text-lg mb-2">📝</div>
                  <p className="text-gray-500">No fields added yet. Start by adding sections and fields above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groupedFields().map((group, groupIndex) => (
                    <div key={groupIndex} className="bg-gray-50 rounded-lg p-4">
                      {group.section && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, formData.fields.findIndex(f => f === group.section))}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, formData.fields.findIndex(f => f === group.section))}
                          className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-3 cursor-move hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-blue-600 mr-2">📋</div>
                              <span className="font-semibold text-blue-900">{group.section.label}</span>
                              <span className="text-xs text-blue-600 ml-2 bg-blue-200 px-2 py-1 rounded">SECTION</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => duplicateField(formData.fields.findIndex(f => f === group.section))}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                title="Duplicate"
                              >
                                📄
                              </button>
                              <button
                                type="button"
                                onClick={() => removeField(formData.fields.findIndex(f => f === group.section))}
                                className="text-red-600 hover:text-red-800 text-sm"
                                title="Remove"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {group.fields.map(({ field, index }) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className="bg-white border border-gray-200 rounded-lg p-3 ml-6 mb-2 cursor-move hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-gray-400 mr-2">
                                {field.type === 'text' && '📝'}
                                {field.type === 'number' && '🔢'}
                                {field.type === 'boolean' && '☑️'}
                              </div>
                              <span className="font-medium text-gray-800">{field.label}</span>
                              <div className="flex items-center ml-3 space-x-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                                  {field.type}
                                </span>
                                {field.required && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => duplicateField(index)}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                                title="Duplicate"
                              >
                                📄
                              </button>
                              <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="text-red-400 hover:text-red-600 text-sm"
                                title="Remove"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/category_management')}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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