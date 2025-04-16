"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  PackageSearch,
  Plus,
  Settings,
  UserCircle,
} from "lucide-react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import Link from "next/link";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { validateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const UserProfileSheet = () => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    _id: "",
    name: "",
    phone: "",
    street: "",
    streetOptional: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (!user.address.length) {
      setAddress({
        _id: "",
        name: "",
        phone: "",
        street: "",
        streetOptional: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/logout`);
    localStorage.removeItem("token");
    resetUser();
    location.reload();
  };

  const { toast } = useToast();

  const handleAddressSubmit = async () => {
    const result = validateAddress(address);
    if (!result.isValid) {
      toast({ title: result.message, variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      if (address._id) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}/${address._id}`,
          address,
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        );
        const addresses = res.data.addresses;

        setUser((prev) => ({
          ...prev,
          address: addresses,
        }));
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}/address`,
          address,
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        );
        const addresses = res.data.addresses;

        setUser((prev) => ({
          ...prev,
          address: addresses,
        }));
        localStorage.setItem("user", JSON.stringify(user));
      }

      setAddress({
        _id: "",
        street: "",
        streetOptional: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        name: "",
        phone: "",
      });
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error saving address", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (addr: any) => {
    setAddress(addr);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user._id}/${addressId}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      const addresses = res.data.addresses;
      console.log(addresses);

      setUser((prev) => ({
        ...prev,
        address: addresses,
      }));
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Address deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  if (!user?.isLoggedIn) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="max-md:px-0 flex items-center gap-2">
          <UserCircle className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[90vw] sm:max-w-[400px] overflow-y-scroll flex flex-col justify-between"
      >
        <div>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-gray-900">
              Profile
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-4 text-sm">
            <div className="space-y-2">
              {/* Info Card */}
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
              ].map((field, idx) => (
                <div key={idx}>
                  <p className="text-xs text-gray-500">{field.label}</p>
                  <div className="bg-white rounded-lg border p-2 text-sm text-gray-900">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/orders">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
              >
                View Orders <PackageSearch className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Address */}
            <ShippingAddressSection
              user={user}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
            />

            {/* Add Address Toggle */}
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setShowAddressForm((prev) => !prev)}
            >
              {showAddressForm ? "Cancel" : "Add Address"}
              <Plus className="w-4 h-4 ml-2" />
            </Button>

            {/* Add Address Form */}
            {showAddressForm && (
              <div className="space-y-2">
                <Input
                  placeholder="Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
                <Input
                  placeholder="Street (Optional)"
                  value={address.streetOptional}
                  onChange={(e) =>
                    setAddress({ ...address, streetOptional: e.target.value })
                  }
                />
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <Input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <Input
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                />
                <Input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
                <Button
                  onClick={handleAddressSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Saving..." : "Save Address"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <SheetFooter>
          <div className="w-full flex flex-col gap-1">
            
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
            >
              Settings <Settings className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="destructive"
              className="w-full flex justify-between items-center"
              onClick={handleLogout}
            >
              Logout <LogOut className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const ShippingAddressSection = ({
  user,
  onEditAddress,
  onDeleteAddress,
}: {
  user: any;
  onEditAddress: (address: any) => void;
  onDeleteAddress: (id: string) => void;
}) => {
  const [primaryAddressId, setPrimaryAddressId] = useState(
    user?.address?.[0]?._id ?? null
  );
  useEffect(() => {
    if (!user.address?.find((addr: any) => addr._id === primaryAddressId)) {
      setPrimaryAddressId(user.address?.[0]?._id ?? null);
    }
  }, [user.address, primaryAddressId]);
  const primaryAddress = user.address?.find(
    (addr: any) => addr._id === primaryAddressId
  );

  if (!primaryAddress) return null;

  return (
    user.address?.length > 0 && (
      <div className="space-y-4">
        <p className="text-xs text-gray-500">Select Shipping Address</p>

        <Select
          value={primaryAddressId}
          onValueChange={(value) => setPrimaryAddressId(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {user.address.map((addr: any) => (
              <SelectItem key={addr._id} value={addr._id}>
                {addr.street}, {addr.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          key={primaryAddress._id}
          className="border rounded-lg p-3 text-sm bg-white space-y-1 shadow"
        >
          <p className="font-medium">{primaryAddress.name}</p>
          <p>{primaryAddress.phone}</p>
          <p>{primaryAddress.street}</p>
          <p>
            {primaryAddress.city}, {primaryAddress.state},{" "}
            {primaryAddress.zipCode}
          </p>
          <p>{primaryAddress.country}</p>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditAddress(primaryAddress)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteAddress(primaryAddressId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
