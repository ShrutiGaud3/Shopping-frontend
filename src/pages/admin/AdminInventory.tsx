import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, fetchProducts, updateStock } = useShop();
  const [stockInputs, setStockInputs] = useState<{ [key: string]: number }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize input state whenever products change
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    products.forEach((p) => {
      initial[p.id] = p.stock !== undefined ? p.stock : 25;
    });
    setStockInputs(initial);
  }, [products]);

  const handleStockChange = (id: string, value: number) => {
    setStockInputs((prev) => ({
      ...prev,
      [id]: Math.max(0, value)
    }));
  };

  const handleSaveStock = async (id: string, name?: string) => {
    const newStock = stockInputs[id];
    if (newStock === undefined) return;
    setUpdatingId(id);
    await updateStock(id, newStock, name);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Warehouse &amp; Stock Inventory
          </h1>
          <p className="text-xs text-gray-500">
            Monitor live stock levels across all SKUs, adjust warehouse inventory, and view low-stock alerts.
          </p>
        </div>

        <button
          onClick={() => fetchProducts()}
          className="bg-gray-900 text-white font-semibold text-xs py-2 px-3 rounded-sm flex items-center gap-2 hover:bg-black transition-colors shadow-xs w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Inventory
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Gender Section</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Update Warehouse Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No products found in the warehouse database.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const stockVal = Math.max(0, p.stock !== undefined ? Number(p.stock) : 25);
                  const skuCode = `VEL-${p.category.slice(0, 3).toUpperCase()}-${p.id.slice(-4).toUpperCase()}`;
                  
                  let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
                  if (stockVal <= 0) status = 'Out of Stock';
                  else if (stockVal <= 10) status = 'Low Stock';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-11 object-cover rounded-xs border border-gray-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{p.name}</span>
                          <span className="text-[10px] text-gray-400">{p.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{p.category}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{p.gender || 'Women'}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-700">{skuCode}</td>
                      <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                        {stockVal} <span className="text-[10px] font-normal text-gray-500">units</span>
                      </td>
                      <td className="py-3 px-4">
                        {status === 'In Stock' && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        )}
                        {status === 'Low Stock' && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Low Stock
                          </span>
                        )}
                        {status === 'Out of Stock' && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockInputs[p.id] !== undefined ? stockInputs[p.id] : stockVal}
                            onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                            className="w-20 bg-gray-50 border border-gray-300 rounded-sm px-2 py-1 text-xs text-center font-bold text-gray-900 focus:outline-none focus:border-gray-900"
                          />
                          <button
                            onClick={() => handleSaveStock(p.id, p.name)}
                            disabled={updatingId === p.id}
                            className="bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1 rounded-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {updatingId === p.id ? 'Saving...' : 'Update'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
