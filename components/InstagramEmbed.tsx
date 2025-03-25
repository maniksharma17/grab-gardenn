import React, { useEffect } from "react";

const InstagramEmbed = ({url}: {url: string}) => {
  useEffect(() => {
    // Load Instagram embed script dynamically
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center mr-2 items-center py-10">
      <blockquote
        className="instagram-media w-full max-w-lg rounded-lg shadow-lg overflow-hidden"
        data-instgrm-permalink={`https://www.instagram.com/reel/${url}/?utm_source=ig_embed`}
        data-instgrm-version="14"
        data-instgrm-hide-caption="true"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      ></blockquote>
    </div>
  );
};

export default InstagramEmbed;
