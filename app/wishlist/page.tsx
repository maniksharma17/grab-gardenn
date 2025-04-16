'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRecoilValue } from 'recoil';
import { userState } from '@/store/atoms/user';

const WishlistPage = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchWishlist();
      fetchAllProducts();
    }
  }, [user]);

  const fetchWishlist = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (data?.wishlist?.items?.length > 0) {
      setWishlistIds(data.wishlist.items);
    } else {
      setWishlistIds([]);
    }
  };

  const fetchAllProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
    const data = await res.json();
    setAllProducts(data.products || []);
  };

  useEffect(() => {
    if (allProducts.length > 0 && wishlistIds.length > 0) {
      const matched = allProducts.filter((product: any) =>
        wishlistIds.includes(product._id)
      );
      setWishlistProducts(matched);
    } else {
      setWishlistProducts([]);
    }
  }, [allProducts, wishlistIds]);

  const removeFromWishlist = async (productId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/remove/${user._id}`,
      {
        method: 'POST',
        body: JSON.stringify({ productId }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.ok) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
    }
  };

  const clearWishlist = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      { method: 'DELETE' }
    );

    if (response.ok) {
      setWishlistIds([]);
    }
  };

  return (
    <div className="py-8 mt-20 bg-white">
      <h2 className="text-4xl text-center">Your Wishlist</h2>

      {wishlistProducts.length === 0 ? (
        <div className="text-center mt-10">
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
        <div className="mt-10 px-4 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div
                key={product._id}
                className="shadow-md rounded-lg border border-gray-200 p-4 flex flex-col justify-between"
              >
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="mt-4 flex-1">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-sm mt-1">{product.description?.slice(0, 60)}...</p>
                  <p className="text-lg font-bold mt-2">₹{product.price?.[0]}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeFromWishlist(product._id)}
                  className="mt-4"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
