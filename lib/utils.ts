import { clsx, type ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localStorageEffect = (key: string) => 
  ({ setSelf, onSet }: any) => {
    if (typeof window === "undefined") return;

    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any, _: any, isReset: boolean) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

  export function useWindowWidth() {
    const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return width;
  }

  type Address = {
    name: string;
    phone: string;
    street: string;
    streetOptional?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  type ValidationResult = {
    isValid: boolean;
    message: string;
  };
  
  export function validateAddress(address: Address): ValidationResult {
    if (!address.name.trim()) {
      return { isValid: false, message: "Name is required." };
    }
  
    if (!address.street.trim()) {
      return { isValid: false, message: "Street is required." };
    }

    if (!address.phone.trim() || address.phone.length < 13) {
      return { isValid: false, message: "Phone number is invalid." };
    }
  
    if (!address.city.trim()) {
      return { isValid: false, message: "City is required." };
    }
  
    if (!address.state.trim()) {
      return { isValid: false, message: "State is required." };
    }
  
    if (!/^\d{6}$/.test(address.zipCode)) {
      return { isValid: false, message: "Zip code must be 6 digits." };
    }
  
    if (!address.country.trim()) {
      return { isValid: false, message: "Country is required." };
    }
  
    return { isValid: true, message: "Address is valid." };
  }
  
