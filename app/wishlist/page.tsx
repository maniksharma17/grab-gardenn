// components/WishlistPage.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const WishlistPage = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch wishlist from the backend (you can replace this with your actual API call)
    const fetchWishlist = async () => {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setWishlist(data.items);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    const response = await fetch(`/api/wishlist/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setWishlist(wishlist.filter((item: any) => item._id !== productId));
    }
  };

  const clearWishlist = async () => {
    const response = await fetch('/api/wishlist/clear', {
      method: 'DELETE',
    });

    if (response.ok) {
      setWishlist([]);
    }
  };

  return (
    <div className="py-8 mt-20 bg-white">
      <h2 className="text-4xl text-center">Your Wishlist</h2>

      {/* If wishlist is empty */}
      {wishlist.length === 0 ? (
        <div className="text-center">
          <p className="text-xl">Your wishlist is empty.</p>
          <Button
            variant="outline"
            onClick={() => router.push('/products')}
            className="mt-4"
          >
            Go to Products
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Display wishlist items */}
          {wishlist.map((item: any) => (
            <div key={item._id} className="shadow-md rounded-lg border border-gray-200 p-6 flex items-center space-x-6">
              <img
                src={item.image || '/default-image.jpg'}
                alt={item.name}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-md">{item.description}</p>
                <p className="text-lg font-bold">{`₹${item.price}`}</p>
              </div>

              {/* Remove button */}
              <Button
                variant="outline"
                onClick={() => removeFromWishlist(item._id)}
              >
                Remove
              </Button>
            </div>
          ))}

          {/* Buttons for clearing wishlist or proceeding to checkout */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="w-1/2 mr-4"
            >
              Clear Wishlist
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/checkout')}
              className="w-1/2"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
