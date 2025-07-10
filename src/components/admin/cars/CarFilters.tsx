import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

interface CarFiltersProps {
  searchTerm: string;
  filterCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const CarFilters: React.FC<CarFiltersProps> = ({
  searchTerm,
  filterCategory,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={20} />}
        />
        
        <Select
          options={[
            { value: '', label: 'All Categories' },
            { value: 'luxury', label: 'Luxury' },
            { value: 'sports', label: 'Sports' },
            { value: 'suv', label: 'SUV' },
            { value: 'sedan', label: 'Sedan' },
            { value: 'convertible', label: 'Convertible' },
          ]}
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>
    </div>
  );
};