import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/customize?category=${category.id}`}
      className="text-decoration-none"
    >
      <div className="category-card text-center p-3 rounded-3 h-100">
        <div className="category-image-wrapper mb-3">
          <img
            src={category.image}
            alt={category.name}
            className="category-image rounded-circle"
            loading="lazy"
          />
        </div>
        <h6 className="category-name text-dark mb-1">{category.name}</h6>
        <small className="text-muted">{category.productTitle}</small>
      </div>
    </Link>
  );
};

export default CategoryCard;
