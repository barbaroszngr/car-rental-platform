import React from 'react';
import { Edit, X, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { Car } from '../../../types';

interface CarListTableProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
  onToggleAvailability: (id: number, available: boolean) => void;
}

export const CarListTable: React.FC<CarListTableProps> = ({
  cars,
  onEditCar,
  onToggleAvailability
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Car</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">License Plate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Price/Day</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Fuel</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-secondary-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={car.image_urls?.length ? car.image_urls[car.main_image_index || 0] : car.image_url} 
                      alt={`${car.make} ${car.model}`}
                      className="h-12 w-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="font-medium">{car.make} {car.model} {car.trim || ''}</div>
                      <div className="text-sm text-secondary-500">{car.year} • {car.color || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm">{car.license_plate || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-secondary-100">
                    {car.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  ${car.price_per_day}/day
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div>{car.fuel_type || 'Gas'}</div>
                    <div className="text-secondary-500">{car.gas_grade || 'Regular'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    car.available 
                      ? 'bg-success-50 text-success-500' 
                      : 'bg-error-50 text-error-500'
                  }`}>
                    {car.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditCar(car)}
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={car.available ? 'outline' : 'primary'}
                      size="sm"
                      className={car.available ? "text-error-500 border-error-500 hover:bg-error-50" : "bg-primary-600"}
                      onClick={() => onToggleAvailability(car.id, !car.available)}
                      leftIcon={car.available ? <X size={16} /> : <Check size={16} />}
                    >
                      {car.available ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};