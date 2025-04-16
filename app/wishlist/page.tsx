"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useRecoilValue } from 'recoil';
import { userState } from '@/store/atoms/user';

const WishlistPage = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const user = useRecoilValue(userState);

  const fetchWishlist = async () => {
    if (!user.isLoggedIn) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if(data.wishlist.length==0) setWishlist([]);
    else setWishlist(data.wishlist.items);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/remove/${user._id}`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setWishlist(wishlist.filter((item: any) => item._id !== productId));
      fetchWishlist()
    }
  };

  const clearWishlist = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setWishlist([]);
      fetchWishlist()
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
