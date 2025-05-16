import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryService } from '../services/inventoryService';
import type { Inventory as InventoryType } from '../types/inventory';
import { useAuth } from '../hooks/useAuth';

export const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailForPdf, setEmailForPdf] = useState('');
  const [sendingPdf, setSendingPdf] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getAll();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await InventoryService.delete(id);
        setInventory(inventory.filter(item => item.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete inventory item');
        console.error(err);
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await InventoryService.generatePDF();
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
      console.error(err);
    }
  };

  const handleSendPDFByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForPdf) {
      setError('Email is required');
      return;
    }
    
    try {
      setSendingPdf(true);
      await InventoryService.sendPDFByEmail(emailForPdf);
      setSendSuccess(true);
      setError(null);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send PDF');
      console.error(err);
    } finally {
      setSendingPdf(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading inventory items...</div>;

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {sendSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">PDF sent successfully!</div>}

      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Inventory Actions</h2>
          {isAdmin && (
            <button
              onClick={() => navigate('/inventory/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Inventory Item
            </button>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Download Report</h3>
              <button 
                onClick={handleDownloadPDF} 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full md:w-auto"
              >
                Download Inventory PDF
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Send Report by Email</h3>
              <form onSubmit={handleSendPDFByEmail} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  type="email"
                  className="border rounded-md px-3 py-2 flex-grow"
                  placeholder="Email address"
                  value={emailForPdf}
                  onChange={(e) => setEmailForPdf(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={sendingPdf}
                >
                  {sendingPdf ? 'Sending...' : 'Send PDF'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
        </div>
        <div className="overflow-x-auto">
          {inventory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No inventory items found</div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Company</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Notes</th>
                  {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">{item.__product__?.name || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">{item.__company__?.name || 'N/A'}</td>
                    <td className="py-3 px-6 text-center">{item.quantity}</td>
                    <td className="py-3 px-6 text-left">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-left">{item.notes || 'N/A'}</td>
                    {isAdmin && (
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <button
                            onClick={() => navigate(`/inventory/edit/${item.id}`)}
                            className="mr-2 transform hover:text-blue-500 hover:scale-110"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="transform hover:text-red-500 hover:scale-110"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
