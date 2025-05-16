import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InventoryService } from '../services/inventoryService';
import type { Inventory, UpdateInventoryDto } from '../types/inventory';

export const EditInventory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UpdateInventoryDto>({
    quantity: 0,
    notes: '',
  });
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await InventoryService.getById(id);
        setInventory(data);
        setFormData({
          quantity: data.quantity,
          notes: data.notes || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    if (formData.quantity !== undefined && formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    
    try {
      setSaving(true);
      await InventoryService.update(id, formData);
      navigate('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory item');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading inventory item...</div>;
  if (!inventory) return <div className="flex justify-center p-8 text-red-500">Inventory item not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Inventory Item</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Item Details</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Product:</span>
                <span className="text-lg font-semibold">{inventory.__product__?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Company:</span>
                <span className="text-lg font-semibold">{inventory.__company__?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300" 
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => navigate('/inventory')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
