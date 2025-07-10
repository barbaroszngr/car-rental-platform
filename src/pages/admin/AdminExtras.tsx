import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Extra, ExtraCategory, ExtraPriceType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ExtrasListTable } from '../../components/admin/extras/ExtrasListTable';
import { ExtraForm } from '../../components/admin/extras/ExtraForm';

const AdminExtras: React.FC = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    price_type: 'per_day' as ExtraPriceType,
    category: 'services' as ExtraCategory,
    stock_quantity: '',
    max_per_booking: '99',
    icon_name: 'Package',
    image_url: '',
    sort_order: '0',
    active: true
  });

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setExtras(data || []);
    } catch (error) {
      console.error('Error fetching extras:', error);
      toast.error('Failed to load extras');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        price_type: formData.price_type,
        category: formData.category,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        max_per_booking: parseInt(formData.max_per_booking) || 99,
        icon_name: formData.icon_name || null,
        image_url: formData.image_url || null,
        sort_order: parseInt(formData.sort_order) || 0,
        active: formData.active
      };

      if (editingExtra) {
        const { error } = await supabase
          .from('extras')
          .update(dataToSubmit)
          .eq('id', editingExtra.id);

        if (error) throw error;
        toast.success('Extra updated successfully');
      } else {
        const { error } = await supabase
          .from('extras')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast.success('Extra created successfully');
      }

      resetForm();
      fetchExtras();
    } catch (error: any) {
      console.error('Error saving extra:', error);
      toast.error(error.message || 'Failed to save extra');
    }
  };

  const handleEdit = (extra: Extra) => {
    setEditingExtra(extra);
    setFormData({
      name: extra.name,
      slug: extra.slug,
      description: extra.description || '',
      price: extra.price.toString(),
      price_type: extra.price_type,
      category: extra.category,
      stock_quantity: extra.stock_quantity?.toString() || '',
      max_per_booking: extra.max_per_booking.toString(),
      icon_name: extra.icon_name || 'Package',
      image_url: extra.image_url || '',
      sort_order: extra.sort_order.toString(),
      active: extra.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Extra deleted successfully');
      fetchExtras();
    } catch (error: any) {
      console.error('Error deleting extra:', error);
      toast.error(error.message || 'Failed to delete extra');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('extras')
        .update({ active })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Extra ${active ? 'activated' : 'deactivated'} successfully`);
      fetchExtras();
    } catch (error) {
      console.error('Error toggling extra status:', error);
      toast.error('Failed to update extra status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      price_type: 'per_day',
      category: 'services',
      stock_quantity: '',
      max_per_booking: '99',
      icon_name: 'Package',
      image_url: '',
      sort_order: '0',
      active: true
    });
    setEditingExtra(null);
    setShowForm(false);
  };

  const filteredExtras = extras.filter(extra =>
    extra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extra.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Extras</h1>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={20} />}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Extra
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search extras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={20} />}
        />
      </div>

      {/* Form */}
      {showForm && (
        <ExtraForm
          formData={formData}
          isEditing={!!editingExtra}
          onFormDataChange={setFormData}
          onNameChange={handleNameChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {/* Extras List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredExtras.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No extras found</p>
        </div>
      ) : (
        <ExtrasListTable
          extras={filteredExtras}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
};

export default AdminExtras;