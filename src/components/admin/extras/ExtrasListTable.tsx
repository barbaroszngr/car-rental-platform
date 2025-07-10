import React from 'react';
import { Edit2, Trash2, Package, Shield, Umbrella, Camera, Tent } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Extra, ExtraCategory } from '../../../types';

interface ExtrasListTableProps {
  extras: Extra[];
  onEdit: (extra: Extra) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const ExtrasListTable: React.FC<ExtrasListTableProps> = ({
  extras,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const getCategoryIcon = (category: ExtraCategory) => {
    switch (category) {
      case 'services': return <Package className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      case 'beach': return <Umbrella className="w-4 h-4" />;
      case 'tech': return <Camera className="w-4 h-4" />;
      case 'camping': return <Tent className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {extras.map((extra) => (
              <tr key={extra.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{extra.name}</div>
                    {extra.description && (
                      <div className="text-sm text-gray-500">{extra.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(extra.category)}
                    <span className="capitalize">{extra.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">${extra.price}</div>
                    <div className="text-sm text-gray-500">{extra.price_type === 'per_day' ? 'Per Day' : 'One Time'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {extra.stock_quantity !== null ? (
                    <span className={`${extra.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {extra.stock_quantity}
                    </span>
                  ) : (
                    <span className="text-gray-500">Unlimited</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleActive(extra.id, !extra.active)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      extra.active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {extra.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(extra)}
                      leftIcon={<Edit2 size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this extra?')) {
                          onDelete(extra.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      leftIcon={<Trash2 size={16} />}
                    >
                      Delete
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