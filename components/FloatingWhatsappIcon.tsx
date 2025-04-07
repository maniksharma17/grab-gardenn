"use client";

import Image from "next/image";
import Link from "next/link";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string; 
  message?: string;
}

export const WhatsAppFloatingButton = ({
  phoneNumber = "919286686912", // Default phone number
  message = "Hello! I have a question.",
}: WhatsAppFloatingButtonProps) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${919286686912}?text=${encodedMessage}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 right-8 z-50"
    >
      <div className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-xl transition-all duration-300">
        <Image 
        src="https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/icons/whatsapp.png"
        alt="WhatsApp Icon"
        width={40}
        height={40}
        className="w-8 h-8"
        unoptimized
        />
      </div>
    </Link>
  );
};
