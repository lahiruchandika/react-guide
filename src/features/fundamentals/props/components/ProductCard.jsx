/**
 * ProductCard.jsx
 * ----------------------------------------------------------------------------
 * A CHILD component that only DISPLAYS what its parent gives it via props.
 *
 * Props received (any JavaScript value can be a prop):
 *   name     string
 *   price    number
 *   inStock  boolean
 *   rating   number (1-5)
 *   tags     array of strings
 *   seller   object  { name, verified }
 *
 * We "destructure" the props object right in the parameter list:
 *   function ProductCard(props)          -> props.name, props.price ...
 *   function ProductCard({ name, price }) -> name, price      (cleaner!)
 * ----------------------------------------------------------------------------
 */
import { Star, BadgeCheck, Package } from 'lucide-react';
import { Badge } from '@/components/ui';

export default function ProductCard({ name, price, inStock, rating, tags, seller }) {
  return (
    <article className="pr-product">
      <div className="pr-product-img">
        <Package size={40} />
      </div>

      <div className="pr-product-body">
        {/* string prop */}
        <h4 className="pr-product-name">{name}</h4>

        {/* number prop - we can do math / formatting with it */}
        <p className="pr-product-price">${price.toFixed(2)}</p>

        {/* number prop used to render 5 stars (filled up to `rating`) */}
        <div className="pr-stars" aria-label={`${rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={16} className={n <= rating ? 'on' : ''} />
          ))}
        </div>

        {/* boolean prop - decides which badge to show */}
        <Badge tone={inStock ? 'success' : 'danger'}>{inStock ? 'In stock' : 'Sold out'}</Badge>

        {/* array prop - rendered as a list */}
        <div className="row pr-tags">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* object prop - read its properties */}
        <p className="small muted pr-seller">
          Sold by <strong>{seller.name}</strong>
          {seller.verified && <BadgeCheck size={14} className="pr-verified" />}
        </p>
      </div>
    </article>
  );
}
