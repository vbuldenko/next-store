"use client";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        priority //Prop to prioritize loading
        className="min-h-[300px] object-cover object-center rounded-2xl"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={clsx(
              "mr-4 cursor-pointer rounded-2xl overflow-hidden hover:shadow-xl hover:scale-110 transition-all duration-200",
              { "shadow-lg": current === index }
            )}
          >
            <Image src={image} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
