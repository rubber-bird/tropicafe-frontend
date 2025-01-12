import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icons from './Icons.jsx';

export default function FilterReviews({ setReviewList, type, id }) {
  const mapper = [1, 2, 3, 4, 5];
  const defaultOptions = {
    rating: [1, 2, 3, 4, 5],
    price: [1, 2, 3, 4, 5],
    category: null
  };
  const [filters, setFilters] = useState(defaultOptions);

  const setCheckboxes = () => {
    return mapper.reduce(
      (values, value) => ({
        ...values,
        [value]: false
      }), {});
  };

  const [ratings, setRatings] = useState(setCheckboxes());
  const [prices, setPrices] = useState(setCheckboxes());
  const [category, setCategory] = useState('');

  const handleCheckboxChange = (e, option) => {
    let { name } = e.target;
    option === 'star' ? (
      setRatings(prev => ({
        ...prev,
        [name]: !prev[name]
      }))
    ) : (
      setPrices(prev => ({
        ...prev,
        [name]: !prev[name]
      }))
    );
  };

  const gatherFilters = filter => (
    Object.keys(filter)
      .filter(checkbox => filter[checkbox])
      .map(checkbox => checkbox)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let rating = gatherFilters(ratings);
    let price = gatherFilters(prices);

    if (!rating.length) { rating = filters.rating; }
    if (!price.length) { price = filters.price; }

    setFilters({
      rating,
      price,
      category
    });
  };

  const api = 'http://3.239.52.75/api/';
  const endpoint = type === 'shop' ? (
    `shops/${id}/reviews`
  ) : (
    `reviews/users/${id}`
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      axios.get(api + endpoint, filters)
        .then(({ data }) => setReviewList(data))
        .catch(e => console.log(e));
    }
    if (!isMounted) { setIsMounted(true); }
  }, [filters]);
  // app.get('/api/reviews/users/:id',
  // app.get('/api/shops/:id/reviews'

  const categories = [
    'Drip Brew',
    'Latte',
    'Cappuccino',
    'Americano',
    'Espresso',
    'Mocha',
    'Tea',
    'Iced Coffee',
    'Cold Brew'
  ];

  const createCheckbox = (option, icon) => (
    <div className="checkbox" key={option}>
      <input
        className="form-check-input"
        type="checkbox"
        name={option}
        onChange={(e) => handleCheckboxChange(e, icon)}
        key={option}
      />
      <label className="form-check-label">
        <Icons icon={icon} i={option} />
      </label>
    </div>
  );

  const createCheckboxes = icon => mapper.map(option => (
    createCheckbox(option, icon)
  ));

  return (
    <>
      <div className="card position-sticky my-3 h-25" style={{width: '15rem'}}>
        <form>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h4 className="card-title">Filters</h4>
            </li>
            <li className="list-group-item">
              <h5 className="card-title">Rating</h5>
              <div className="form-check">
                {createCheckboxes('star')}
              </div>
            </li>
            <li className="list-group-item">
              <h5 className="card-title">Price</h5>
              <div className="form-check">
                {createCheckboxes('dollar')}
              </div>
            </li>
            <li className="list-group-item">
              <h5 className="card-title">Drink type</h5>
              <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a drink</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </li>
            <li className="list-group-item">
              <input
                className="btn btn-primary me-3"
                type="submit"
                value="Update"
                onClick={handleSubmit}
              />
              <button
                className="btn btn-primary sm-button"
                type="button"
                onClick={() => setFilters(defaultOptions)}
              >
                Clear
              </button>
            </li>
          </ul>
        </form>
      </div>
    </>
  );
}
