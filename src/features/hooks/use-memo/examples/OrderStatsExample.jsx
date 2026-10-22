/**
 * OrderStatsExample.jsx
 * ----------------------------------------------------------------------------
 * Understanding the DEPENDENCY ARRAY.
 *
 *   const stats = useMemo(() => calculateStats(orders), [orders]);
 *
 * - "Add order" / "Remove last" create a NEW orders array -> stats recompute.
 * - Changing the shop name or tax rate does NOT touch `orders` -> cached.
 * - The tax total is cheap (one multiplication), so it is NOT memoised.
 *   Don't wrap everything in useMemo - only work that is actually expensive
 *   or values whose reference must stay stable.
 *
 * The log on the right is written by a useEffect that runs only when the
 * `stats` object changes, i.e. only when useMemo actually recomputed.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { timeStamp } from '../utils/products';

const CUSTOMERS = ['Ava', 'Liam', 'Noah', 'Mia', 'Zoe', 'Ethan', 'Isla', 'Leo'];

let nextId = 4; // simple id generator for new orders (module level)

const INITIAL_ORDERS = [
  { id: 1, customer: 'Ava', amount: 120 },
  { id: 2, customer: 'Liam', amount: 75 },
  { id: 3, customer: 'Mia', amount: 210 },
];

export default function OrderStatsExample() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [shopName, setShopName] = useState('Corner Shop');
  const [taxRate, setTaxRate] = useState(10);
  const [log, setLog] = useState([]);

  // 1. Derived data: recompute ONLY when `orders` changes.
  const stats = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    return {
      count: orders.length,
      total,
      average: orders.length ? total / orders.length : 0,
      biggest: orders.reduce((max, o) => Math.max(max, o.amount), 0),
    };
  }, [orders]);

  // 2. Cheap calculation: no useMemo needed.
  const tax = (stats.total * taxRate) / 100;

  // 3. Log every time a NEW stats object appears.
  //    (The identity check avoids a duplicate entry when StrictMode runs effects twice.)
  useEffect(() => {
    setLog((prev) => (prev[0]?.stats === stats ? prev : [{ stats, at: timeStamp() }, ...prev].slice(0, 6)));
  }, [stats]);

  // Updating state immutably: a NEW array, never orders.push(...)
  const addOrder = () => {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    setOrders((prev) => [...prev, { id: nextId++, customer, amount: 20 + Math.round(Math.random() * 280) }]);
  };
  const removeLast = () => setOrders((prev) => prev.slice(0, -1));

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="grid-2">
          <Input label="Shop name (unrelated)" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          <Input label="Tax rate % (cheap calc)" type="number" min={0} max={50} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
        </div>

        <div className="um-panel">
          <strong>{shopName || 'Unnamed shop'}</strong>
          <div className="um-panel-metrics um-metrics-4">
            <div>
              <span className="um-stat-label">Orders</span>
              <span className="um-stat-value">{stats.count}</span>
            </div>
            <div>
              <span className="um-stat-label">Total</span>
              <span className="um-stat-value">${stats.total}</span>
            </div>
            <div>
              <span className="um-stat-label">Average</span>
              <span className="um-stat-value">${stats.average.toFixed(0)}</span>
            </div>
            <div>
              <span className="um-stat-label">Tax</span>
              <span className="um-stat-value">${tax.toFixed(2)}</span>
            </div>
          </div>
          <ul className="um-product-list">
            {orders.map((o) => (
              <li key={o.id}>
                <span>
                  #{o.id} · {o.customer}
                </span>
                <b>${o.amount}</b>
              </li>
            ))}
          </ul>
          <div className="row">
            <Button size="sm" icon={<Plus size={14} />} onClick={addOrder}>
              Add order
            </Button>
            <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={removeLast} disabled={!orders.length}>
              Remove last
            </Button>
          </div>
        </div>
      </div>

      {/* Log panel: shows when the memoised calculation really ran */}
      <div className="um-log">
        <span className="box-label">useMemo recompute log</span>
        {log.map((entry) => (
          <div key={entry.at} className="um-log-line">
            <span className="um-mono">{entry.at}</span> stats recomputed → {entry.stats.count} orders, ${entry.stats.total}
          </div>
        ))}
        <p className="small muted" style={{ marginTop: 'auto', marginBottom: 0 }}>
          Edit the shop name or tax rate: no new log lines. Add/remove orders: a new line appears.
        </p>
      </div>
    </div>
  );
}
