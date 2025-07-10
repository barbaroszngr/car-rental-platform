import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { CarListTable } from '../../components/admin/cars/CarListTable';
import { CarFilters } from '../../components/admin/cars/CarFilters';
import { CarFormModal } from '../../components/admin/cars/CarFormModal';
import { useAdminStore } from '../../stores/adminStore';
import type { Car } from '../../types/index';


const AdminCars: React.FC = () => {
  const { 
    allCars, 
    loading, 
    error,
    fetchAllCars,
    addCar,
    updateCar,
    toggleCarAvailability
  } = useAdminStore();
  
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: 0,
    category: '',
    image_url: '',
    image_urls: [] as string[],
    main_image_index: 0,
    description: '',
    features: [] as string[],
    seats: 5,
    transmission: 'Automatic',
    mileage_type: 'Unlimited',
    available: true,
    trim: '',
    color: '',
    license_plate: '',
    doors: 4,
    fuel_type: 'Gas',
    gas_grade: 'Regular',
  });
  
  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);
  
  const handleAddFeature = () => {
    if (!customFeature.trim()) return;
    
    const feature = customFeature.trim();
    const features = editingCar?.features || newCar.features;
    
    if (!features.includes(feature)) {
      if (editingCar) {
        setEditingCar({ ...editingCar, features: [...features, feature] });
      } else {
        setNewCar({ ...newCar, features: [...features, feature] });
      }
    }
    
    setCustomFeature('');
  };
  
  const handleRemoveFeature = (feature: string) => {
    const features = editingCar?.features || newCar.features;
    const updatedFeatures = features.filter(f => f !== feature);
    
    if (editingCar) {
      setEditingCar({ ...editingCar, features: updatedFeatures });
    } else {
      setNewCar({ ...newCar, features: updatedFeatures });
    }
  };
  
  const handleToggleCommonFeature = (feature: string) => {
    const features = editingCar?.features || newCar.features;
    const hasFeature = features.includes(feature);
    
    const updatedFeatures = hasFeature
      ? features.filter(f => f !== feature)
      : [...features, feature];
    
    if (editingCar) {
      setEditingCar({ ...editingCar, features: updatedFeatures });
    } else {
      setNewCar({ ...newCar, features: updatedFeatures });
    }
  };
  
  const handleAddCar = async () => {
    try {
      if (newCar.features.length === 0) {
        toast.error('Please add at least one feature');
        return;
      }
      
      await addCar(newCar);
      setIsAddingCar(false);
      setNewCar({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price_per_day: 0,
        category: '',
        image_url: '',
        image_urls: [],
        main_image_index: 0,
        description: '',
        features: [],
        seats: 5,
        transmission: 'Automatic',
        mileage_type: 'Unlimited',
        available: true,
        trim: '',
        color: '',
        license_plate: '',
        doors: 4,
        fuel_type: 'Gas',
        gas_grade: 'Regular',
      });
      toast.success('Car added successfully');
    } catch (error) {
      toast.error('Failed to add car');
    }
  };
  
  const handleUpdateCar = async (car: Car) => {
    try {
      if (car.features.length === 0) {
        toast.error('Please add at least one feature');
        return;
      }
      
      // Updating car with image data
      
      await updateCar(car.id, car);
      setEditingCar(null);
      toast.success('Car updated successfully');
    } catch (error) {
      toast.error('Failed to update car');
    }
  };
  
  const handleToggleAvailability = async (id: number, available: boolean) => {
    try {
      await toggleCarAvailability(id, available);
      toast.success(`Car ${available ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update car availability');
    }
  };
  
  const filteredCars = allCars.filter(car => {
    const matchesSearch = (
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = !filterCategory || car.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-800"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center bg-secondary-50">
        <div className="bg-error-50 text-error-500 p-4 rounded-md">
          Error loading cars: {error}
        </div>
      </div>
    );
  }
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Cars', path: '/admin/cars' }
  ];

  return (
    <div className="min-h-screen pt-16 pb-12 bg-secondary-50">
      <div className="container-custom">
        <PageHeader
          title="Manage Cars"
          subtitle="Add, edit, and manage your car inventory"
          breadcrumbItems={breadcrumbItems}
          fallbackPath="/admin"
          actions={
            <div className="flex gap-2">
              <Button 
                variant="primary"
                onClick={() => setIsAddingCar(true)}
                leftIcon={<Plus size={20} />}
              >
                Add New Car
              </Button>
            </div>
          }
        />
        
        {/* Filters */}
        <CarFilters
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setFilterCategory}
        />
        
        {/* Cars List */}
        <CarListTable
          cars={filteredCars}
          onEditCar={setEditingCar}
          onToggleAvailability={handleToggleAvailability}
        />
      </div>
      
      {/* Add/Edit Car Modal */}
      <CarFormModal
        isOpen={isAddingCar || !!editingCar}
        isEditing={!!editingCar}
        car={editingCar || newCar}
        customFeature={customFeature}
        onCarChange={editingCar ? setEditingCar : setNewCar}
        onCustomFeatureChange={setCustomFeature}
        onToggleFeature={handleToggleCommonFeature}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onSave={() => editingCar ? handleUpdateCar(editingCar) : handleAddCar()}
        onClose={() => {
          setIsAddingCar(false);
          setEditingCar(null);
          setCustomFeature('');
        }}
      />
    </div>
  );
};

export default AdminCars;