'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userState } from '@/store/atoms/user';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const {toast} = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateAddress(address);
    if (!result.isValid) {
      toast({description: result.message, variant: 'destructive'});
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/complete-profile/${user._id}`,
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

      setUser((prev) => ({
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
    <div className="max-w-2xl mx-auto mt-16 p-6 shadow-md rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h4 className="text-gray-600 text-sm font-medium">PERSONAL INFORMATION</h4>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <div className="my-2">
            <PhoneInput
              country={'in'}
              value={phone}
              onChange={(e) => setPhone('+' + e)}
              inputClass="!w-full !h-12 !text-md"
              inputStyle={{ borderRadius: '8px', width: '100%' }}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <h4 className="border-t pt-4 mt-4 text-gray-600 text-sm font-medium">SHIPPING INFO</h4>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium ml-1">Name</label>
            <Input
              type="text"
              value={address.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium ml-1">Phone</label>
            <PhoneInput
              country={'in'}
              value={address.phone}
              onChange={(e) => handleChange('phone', '+' + e)}
              inputClass="!w-full !h-12 !text-md"
              inputStyle={{ borderRadius: '8px', width: '100%' }}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="text-xs font-medium ml-1">Street 1</label>
            <Input
              type="text"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium ml-1">Street 2 <span className="text-xs">(Optional)</span></label>
            <Input
              type="text"
              value={address.streetOptional}
              onChange={(e) => handleChange('streetOptional', e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium ml-1">City</label>
              <Input
                type="text"
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium ml-1">State</label>
              <Input
                type="text"
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium ml-1">Pin Code</label>
            <Input
              type="text"
              value={address.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium ml-1">Country</label>
            <Input
              type="text"
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Save and Continue
        </Button>
      </form>
    </div>
  );
}