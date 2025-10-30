import React, { useEffect, useMemo, useState } from 'react';
import { Order, OrderItem } from '../types/types';
import { alertSuccess, alertError } from '../lib/alert';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/usersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { createOrder, fetchOrders } from '../store/slices/ordersSlice';
import CommonTable, { TableColumn } from './common/CommonTable';

const OrderCreation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: users } = useAppSelector(s => s.users);
  const { items: products } = useAppSelector(s => s.products);
  const { items: orders, loading: ordersLoading, error: ordersError } = useAppSelector(s => s.orders);
  const [formData, setFormData] = useState<{ userId: string; items: OrderItem[] }>({ userId: '', items: [] });
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    dispatch(fetchUsers()).catch(() => setError('Error fetching users'));
    dispatch(fetchProducts()).catch(() => setError('Error fetching products'));
    dispatch(fetchOrders()).catch(() => setError('Error fetching orders'));
  }, [dispatch]);

  const addItem = (productId: string, quantity: number): void => {
    const product = products.find(p => p._id === productId);
    if (product && quantity > 0) {
      const existingItemIndex = formData.items.findIndex(item => item.productId === productId);
      if (existingItemIndex > -1) {
        const updatedItems = [...formData.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].price = product.price;
        setFormData({ ...formData, items: updatedItems });
      } else {
        setFormData({
          ...formData,
          items: [...formData.items, { productId, quantity, price: product.price }]
        });
      }
    }
  };

  const incrementItem = (productId: string): void => {
    addItem(productId, 1);
  };

  const decrementItem = (productId: string): void => {
    const idx = formData.items.findIndex(i => i.productId === productId);
    if (idx > -1) {
      const updated = [...formData.items];
      const nextQty = updated[idx].quantity - 1;
      if (nextQty <= 0) {
        // remove if quantity reaches 0
        setFormData({ ...formData, items: updated.filter(i => i.productId !== productId) });
      } else {
        updated[idx].quantity = nextQty;
        setFormData({ ...formData, items: updated });
      }
    }
  };

  const removeItem = (productId: string): void => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId !== productId)
    });
  };

  const calculateTotal = (): number => {
    return formData.items.reduce(
      (total, item) => total + (item.quantity * (item.price ?? 1)),
      0
    );
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const orderData = {
      ...formData,
      totalAmount: calculateTotal()
    };
    dispatch(createOrder(orderData))
      .then(() => {
        alertSuccess('Order created');
        setFormData({ userId: '', items: [] });
      })
      .catch(() => { setError('Error creating order'); alertError('Create failed', 'Could not create order'); });
  };

  const orderColumns: Array<TableColumn<Order>> = useMemo(() => ([
    { key: 'id', header: 'Order #', accessor: (o) => o._id },
    { key: 'user', header: 'User', accessor: (o) => users.find(u => u._id === o.userId)?.name ?? o.userId },
    { key: 'items', header: 'Items', accessor: (o) => o.items.length },
    { key: 'total', header: 'Total', accessor: (o) => `$${o.totalAmount.toFixed(2)}` },
    { key: 'date', header: 'Date', accessor: (o) => new Date(o.orderDate).toLocaleString() },
  ]), [users]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Order Creation</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select 
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Add Item</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 sm:col-span-3"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} — ${p.price}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
            <button
              type="button"
              onClick={() => {
                if (selectedProductId && selectedQuantity > 0) {
                  addItem(selectedProductId, selectedQuantity);
                  setSelectedProductId('');
                  setSelectedQuantity(1);
                }
              }}
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
              disabled={!selectedProductId}
            >
              Add to Order
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Order Items</h3>
          {formData.items.length > 0 ? (
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Unit Price</th>
                    <th className="px-4 py-3 font-medium">Quantity</th>
                    <th className="px-4 py-3 font-medium">Subtotal</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item, index) => {
                    const product = products.find(p => p._id === item.productId);
                    const name = product?.name ?? item.productId;
                    const unit = item.price ?? 0;
                    const subtotal = unit * item.quantity;
                    return (
                      <tr key={`${item.productId}-${index}`}>
                        <td className="px-4 py-3">{name}</td>
                        <td className="px-4 py-3">${unit}</td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center gap-2">
                            <button type="button" onClick={() => decrementItem(item.productId)} className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-50">-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => incrementItem(item.productId)} className="rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-50">+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3">${subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button type="button" className="text-red-600 hover:underline" onClick={() => removeItem(item.productId)}>Remove</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-1">No items added.</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
          <button type="submit" disabled={!formData.userId || formData.items.length === 0} className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">Create Order</button>
        </div>
      </form>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">All Orders</h2>
        {ordersError && <p className="text-sm text-red-600">{ordersError}</p>}
        <CommonTable<Order>
          columns={orderColumns}
          data={orders}
          getRowKey={(row) => row._id}
          emptyMessage="No orders found"
          isLoading={ordersLoading}
        />
      </div>
    </div>
  );
};

export default OrderCreation;