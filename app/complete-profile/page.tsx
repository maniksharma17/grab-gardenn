'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userState } from '@/store/atoms/user';

export default function CompleteProfile() {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    streetOptional: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-profile`,
        {
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(prev => ({
        ...prev,
        phone: res.data.phone,
        address: res.data.address,
      }));

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          phone: res.data.phone,
          address: res.data.address,
        })
      );

      router.push('/products');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 shadow-md rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {[
          { label: 'Shipping Name', key: 'name' },
          { label: 'Shipping Phone', key: 'phone' },
          { label: 'Street Address', key: 'street' },
          { label: 'Street (Optional)', key: 'streetOptional' },
          { label: 'City', key: 'city' },
          { label: 'State', key: 'state' },
          { label: 'Country', key: 'country' },
          { label: 'Zip Code', key: 'zipCode' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block font-medium">{label}</label>
            <input
              type="text"
              value={(address as any)[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              required={key !== 'streetOptional'}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}
