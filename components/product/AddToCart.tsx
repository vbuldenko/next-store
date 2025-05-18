"use client";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import { Cart, CartItem } from "@/types";
// import { useToast } from "@/hooks/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  // const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    toast.success("My first toast");
    toast.error("My second toast");
    toast("This is go to cart toast", {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
    });
    startTransition(async () => {
      //   const res = await addItemToCart(item);
      //   if (!res.success) {
      //     toast({
      //       variant: "destructive",
      //       description: res.message,
      //     });
      //     return;
      //   }
      //   // Handle success add to cart
      //   toast({
      //     description: res.message,
      //     action: (
      //       <ToastAction
      //         className="bg-primary text-white hover:bg-gray-800"
      //         altText="Go To Cart"
      //         onClick={() => router.push("/cart")}
      //       >
      //         Go To Cart
      //       </ToastAction>
      //     ),
      //   });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      //   const res = await removeItemFromCart(item.productId);
      //   toast({
      //     variant: res.success ? "default" : "destructive",
      //     description: res.message,
      //   });
      //   return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <ImSpinner8 className="size-4 animate-spin" />
        ) : (
          <AiOutlineMinus className="size-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <ImSpinner8 className="size-4 animate-spin" />
        ) : (
          <AiOutlinePlus className="size-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full flex gap-2 items-center justify-center"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <ImSpinner8 className="size-4 animate-spin" />
      ) : (
        <AiOutlinePlus className="size-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
