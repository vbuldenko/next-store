import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export const EmptyCartState = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 px-4 py-8">
    {/* Enhanced Icon with floating elements */}
    <div className="relative">
      {/* Main icon container */}
      <div className="relative w-32 h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center shadow-xl">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-950 to-indigo-600 rounded-2xl flex items-center justify-center">
          <HiOutlineShoppingBag className="w-14 h-14 text-white" />
        </div>
      </div>
    </div>

    {/* Enhanced Content */}
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Your cart is empty!
        </h2>
      </div>

      <p className="text-lg text-gray-600 leading-relaxed">
        Discover thousands of items
        <span className="text-blue-800 font-medium">
          {" "}
          handpicked just for you!
        </span>
      </p>
    </div>

    {/* Enhanced Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <Link href="/" className="flex-1">
        <Button
          size="lg"
          className="w-full px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500"
        >
          Start Shopping
        </Button>
      </Link>

      <Link href="/categories" className="flex-1">
        <Button
          variant="outline"
          size="lg"
          className="w-full px-8 py-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-900 font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300"
        >
          Browse Categories
        </Button>
      </Link>
    </div>

    {/* Categories Section */}
    {/* <Card className="mt-10 w-full max-w-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border-0 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Popular Categories
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-200 pt-6">
          {[
            {
              name: "Electronics",
              color: "from-blue-500 to-blue-600",
            },
            {
              name: "Fashion",
              color: "from-pink-500 to-rose-600",
            },
            {
              name: "Home",
              color: "from-green-500 to-emerald-600",
            },
            {
              name: "Sports",
              color: "from-orange-500 to-red-600",
            },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/search?category=${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="flex gap-2 items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:scale-105">
                <span
                  className={cn(
                    "rounded-full size-4 bg-gradient-to-r ",
                    `${category.color}`
                  )}
                ></span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card> */}
  </div>
);
