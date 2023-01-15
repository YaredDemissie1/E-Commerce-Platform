import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import styled from 'styled-components';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ReviewSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Star = styled(FaStar)`
  cursor: pointer;
  color: ${props => props.filled ? '#ffc107' : '#ddd'};
`;

const ReviewCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const WishlistButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${props => props.inWishlist ? '#dc3545' : '#6c757d'};
  
  &:hover {
    color: #dc3545;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { currentUser } = useSelector(state => state.user);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInWishlist(response.data.some(item => item._id === id));
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    if (currentUser) {
      checkWishlist();
    }
  }, [id, currentUser]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProduct();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/products/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProduct();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (inWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/wishlist/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <ProductContainer>
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h2>${product.price}</h2>
        <p>In Stock: {product.countInStock}</p>
        <Button 
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        {currentUser && (
          <WishlistButton
            onClick={handleWishlistToggle}
            inWishlist={inWishlist}
          >
            {inWishlist ? <FaHeart /> : <FaRegHeart />}
          </WishlistButton>
        )}
      </ProductInfo>

      <ReviewSection>
        <h3>Reviews ({product.numReviews})</h3>
        <div>Average Rating: {product.rating.toFixed(1)} / 5</div>

        {currentUser && (
          <ReviewForm onSubmit={handleSubmitReview}>
            <h4>Write a Review</h4>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= (hoveredRating || rating)}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </StarRating>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            <Button type="submit">Submit Review</Button>
          </ReviewForm>
        )}

        {product.reviews.map((review) => (
          <ReviewCard key={review._id}>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} filled={star <= review.rating} />
              ))}
            </div>
            <p><strong>{review.name}</strong></p>
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            {currentUser && (currentUser.id === review.user || currentUser.isAdmin) && (
              <Button onClick={() => handleDeleteReview(review._id)}>Delete</Button>
            )}
          </ReviewCard>
        ))}
      </ReviewSection>
    </ProductContainer>
  );
};

export default ProductDetail; 