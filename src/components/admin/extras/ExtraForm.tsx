import React from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { Extra } from '../../../types';

const categoryOptions = [
  { value: 'services', label: 'Services' },
  { value: 'safety', label: 'Safety' },
  { value: 'beach', label: 'Beach' },
  { value: 'tech', label: 'Technology' },
  { value: 'camping', label: 'Camping' }
];

const priceTypeOptions = [
  { value: 'per_day', label: 'Per Day' },
  { value: 'one_time', label: 'One Time' }
];

const iconOptions = [
  'Fuel', 'Sparkles', 'Baby', 'Armchair', 'Umbrella', 'ShoppingCart', 
  'Package', 'Backpack', 'Package2', 'Camera', 'Battery'
];

interface ExtraFormProps {
  formData: any;
  isEditing: boolean;
  onFormDataChange: (data: any) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ExtraForm: React.FC<ExtraFormProps> = ({
  formData,
  isEditing,
  onFormDataChange,
  onNameChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Extra' : 'Add New Extra'}
      </h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Name"
              value={formData.name}
              onChange={onNameChange}
              required
            />
          </div>
          
          <div>
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => onFormDataChange({ ...formData, slug: e.target.value })}
              required
              disabled={isEditing}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
            />
          </div>
          
          <div>
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Select
              label="Price Type"
              options={priceTypeOptions}
              value={formData.price_type}
              onChange={(e) => onFormDataChange({ ...formData, price_type: e.target.value })}
            />
          </div>
          
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
            />
          </div>
          
          <div>
            <Input
              label="Stock Quantity (leave empty for unlimited)"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => onFormDataChange({ ...formData, stock_quantity: e.target.value })}
            />
          </div>
          
          <div>
            <Input
              label="Max Per Booking"
              type="number"
              value={formData.max_per_booking}
              onChange={(e) => onFormDataChange({ ...formData, max_per_booking: e.target.value })}
            />
          </div>
          
          <div>
            <Select
              label="Icon"
              options={iconOptions.map(icon => ({ value: icon, label: icon }))}
              value={formData.icon_name}
              onChange={(e) => onFormDataChange({ ...formData, icon_name: e.target.value })}
            />
          </div>
          
          <div>
            <Input
              label="Sort Order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => onFormDataChange({ ...formData, sort_order: e.target.value })}
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => onFormDataChange({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Update' : 'Create'} Extra
          </Button>
        </div>
      </form>
    </div>
  );
};