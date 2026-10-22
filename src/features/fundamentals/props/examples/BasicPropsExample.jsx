/**
 * BasicPropsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: passing different kinds of values as props.
 *
 * Props are like function arguments for components:
 *   <ProductCard name="Headphones" price={59.99} inStock tags={['a','b']} />
 *
 *   - strings can use quotes:      name="Headphones"
 *   - everything else uses { }:    price={59.99}  inStock={true}  seller={{...}}
 *   - a prop with no value = true: <ProductCard inStock />
 *
 * Data flows ONE WAY: parent -> child. Change the controls (parent state) and
 * the child re-renders with the new props. The right panel shows exactly
 * what the child receives.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Input } from '@/components/ui';
import ProductCard from '../components/ProductCard';

export default function BasicPropsExample() {
  // The PARENT owns the data (state). The child just displays it.
  const [name, setName] = useState('Wireless Headphones');
  const [price, setPrice] = useState(59.99);
  const [inStock, setInStock] = useState(true);
  const [rating, setRating] = useState(4);
  const [verified, setVerified] = useState(true);

  // Collect the props in an object so we can also display them as JSON.
  const props = {
    name,
    price,
    inStock,
    rating,
    tags: ['Bluetooth', 'Noise cancelling'],
    seller: { name: 'SoundShop', verified },
  };

  return (
    <div className="pr-basic">
      {/* ---- Controls: the parent changes its own state ---- */}
      <div className="stack">
        <Input label="name (string)" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="price (number)"
          type="number"
          step="0.5"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <label className="field">
          <span className="field-label">rating (number): {rating}</span>
          <input type="range" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </label>
        <label className="row small">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          inStock (boolean)
        </label>
        <label className="row small">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          seller.verified (inside an object)
        </label>
      </div>

      {/* ---- The child: every prop is passed explicitly ---- */}
      <div className="pr-center">
        <ProductCard
          name={name}
          price={price}
          inStock={inStock}
          rating={rating}
          tags={props.tags}
          seller={props.seller}
        />
      </div>

      {/* ---- What the child actually receives ---- */}
      <div className="pr-json">
        <span className="box-label">props received by &lt;ProductCard&gt;</span>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    </div>
  );
}
