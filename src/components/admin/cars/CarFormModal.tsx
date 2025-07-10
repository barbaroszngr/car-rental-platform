import React from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { SimpleImageUploader } from '../../ui/SimpleImageUploader';
import type { Car } from '../../../types';

const COMMON_FEATURES = [
  'Backup Camera',
  'Blind Spot Warning',
  'AUX Input',
  'Android Auto',
  'Apple CarPlay',
  'Bluetooth',
  'USB Charger',
  'USB Input',
  'GPS',
  'Heated Seats',
  'Sunroof',
  'Adaptive Cruise Control',
  'Brake Assist',
  'Lane Departure Warning',
  'Lane Keeping Assist',
  'All-wheel Drive',
  'Convertible'
];

interface CarFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  car: any;
  customFeature: string;
  onCarChange: (car: any) => void;
  onCustomFeatureChange: (value: string) => void;
  onToggleFeature: (feature: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (feature: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  isEditing,
  car,
  customFeature,
  onCarChange,
  onCustomFeatureChange,
  onToggleFeature,
  onAddFeature,
  onRemoveFeature,
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold">
            {isEditing ? 'Edit Car' : 'Add New Car'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-all duration-200 group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-secondary-600 group-hover:text-secondary-800" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Make"
              value={car.make}
              onChange={(e) => onCarChange({ ...car, make: e.target.value })}
            />
            
            <Input
              label="Model"
              value={car.model}
              onChange={(e) => onCarChange({ ...car, model: e.target.value })}
            />
            
            <Input
              label="Trim"
              value={car.trim}
              onChange={(e) => onCarChange({ ...car, trim: e.target.value })}
            />
            
            <Input
              label="Year"
              type="number"
              value={car.year}
              onChange={(e) => onCarChange({ ...car, year: parseInt(e.target.value) })}
            />
            
            <Input
              label="Color"
              value={car.color}
              onChange={(e) => onCarChange({ ...car, color: e.target.value })}
            />
            
            <Input
              label="License Plate"
              value={car.license_plate}
              onChange={(e) => onCarChange({ ...car, license_plate: e.target.value.toUpperCase() })}
            />
            
            <Input
              label="Price per Day"
              type="number"
              value={car.price_per_day}
              onChange={(e) => onCarChange({ ...car, price_per_day: parseFloat(e.target.value) })}
            />
            
            <Select
              label="Category"
              options={[
                { value: 'luxury', label: 'Luxury' },
                { value: 'sports', label: 'Sports' },
                { value: 'suv', label: 'SUV' },
                { value: 'sedan', label: 'Sedan' },
                { value: 'convertible', label: 'Convertible' },
              ]}
              value={car.category}
              onChange={(e) => onCarChange({ ...car, category: e.target.value })}
            />
            
            <Select
              label="Number of Doors"
              options={[
                { value: '2', label: '2 Doors' },
                { value: '4', label: '4 Doors' },
                { value: '5', label: '5 Doors' },
              ]}
              value={car.doors?.toString()}
              onChange={(e) => onCarChange({ ...car, doors: parseInt(e.target.value) })}
            />
            
            <Input
              label="Number of Seats"
              type="number"
              min="2"
              max="8"
              value={car.seats}
              onChange={(e) => onCarChange({ ...car, seats: parseInt(e.target.value) })}
            />
            
            <Select
              label="Fuel Type"
              options={[
                { value: 'Gas', label: 'Gas' },
                { value: 'Electric', label: 'Electric' },
                { value: 'Hybrid', label: 'Hybrid' },
              ]}
              value={car.fuel_type}
              onChange={(e) => onCarChange({ ...car, fuel_type: e.target.value })}
            />
            
            <Select
              label="Gas Grade"
              options={[
                { value: 'Regular', label: 'Regular' },
                { value: 'Premium', label: 'Premium' },
                { value: 'N/A', label: 'N/A' },
              ]}
              value={car.gas_grade}
              onChange={(e) => onCarChange({ ...car, gas_grade: e.target.value })}
            />
            
            <SimpleImageUploader
              label="Araç Fotoğrafları"
              initialImages={car.image_urls || (car.image_url ? [car.image_url] : [])}
              initialMainIndex={car.main_image_index || 0}
              onImagesChange={(urls: string[], mainIndex: number) => {
                onCarChange({ 
                  ...car, 
                  image_urls: urls,
                  main_image_index: mainIndex,
                  // Legacy desteği
                  image_url: urls.length > 0 ? urls[mainIndex] : car.image_url || ''
                });
              }}
              bucketName="car-images"
              folderPath="cars"
              itemId={car.id}
              maxFiles={5}
            />

            <Select
              label="Transmission"
              options={[
                { value: 'Automatic', label: 'Automatic' },
                { value: 'Manual', label: 'Manual' },
                { value: 'Semi-Automatic', label: 'Semi-Automatic' },
              ]}
              value={car.transmission}
              onChange={(e) => onCarChange({ ...car, transmission: e.target.value })}
            />

            <Select
              label="Mileage Type"
              options={[
                { value: 'Unlimited', label: 'Unlimited' },
                { value: '150 miles/day', label: '150 miles/day' },
                { value: '200 miles/day', label: '200 miles/day' },
                { value: '300 miles/day', label: '300 miles/day' },
              ]}
              value={car.mileage_type}
              onChange={(e) => onCarChange({ ...car, mileage_type: e.target.value })}
            />
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                value={car.description}
                onChange={(e) => onCarChange({ ...car, description: e.target.value })}
              />
            </div>
            
            {/* Features Section */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              
              {/* Common Features */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {COMMON_FEATURES.map((feature) => {
                  const isSelected = car.features.includes(feature);
                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => onToggleFeature(feature)}
                      className={`p-2 rounded-md text-sm flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-secondary-50 text-secondary-700 border-secondary-200'
                      } border hover:bg-opacity-80 transition-colors`}
                    >
                      <span>{feature}</span>
                      {isSelected && <Check size={16} className="ml-2" />}
                    </button>
                  );
                })}
              </div>
              
              {/* Custom Feature Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom feature..."
                  value={customFeature}
                  onChange={(e) => onCustomFeatureChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddFeature()}
                />
                <Button
                  type="button"
                  onClick={onAddFeature}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              
              {/* Selected Features */}
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature: string) => (
                  <span
                    key={feature}
                    className="bg-primary-50 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => onRemoveFeature(feature)}
                      className="ml-2 hover:text-error-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onSave}
            >
              {isEditing ? 'Update Car' : 'Add Car'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};