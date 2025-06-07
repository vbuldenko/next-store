import { Metadata } from "next";
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { HiOutlineShoppingBag, HiOutlineCalendarDays } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "My Orders",
};

const StatusBadge = ({
  isTrue,
  trueText,
  falseText,
  date,
}: {
  isTrue: boolean;
  trueText: string;
  falseText: string;
  date?: Date | null;
}) => (
  <div className="flex flex-col gap-2">
    <span
      className={`flex-center px-2.5 py-1 rounded-full text-xs font-medium ${
        isTrue
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-gray-100 text-gray-600 border border-gray-200"
      }`}
    >
      {isTrue ? trueText : falseText}
    </span>
    {isTrue && date && (
      <span className="text-xs text-gray-500">
        {formatDateTime(date).dateOnly}
      </span>
    )}
  </div>
);

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({ page: Number(page) || 1 });

  if (orders.data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            {"You haven't placed any orders yet. Start shopping!"}
          </p>
          <Button>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <HiOutlineShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {orders.data.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-w-[15rem]">
              {/* Order ID & Date */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Order ID
                  </span>
                </div>
                <p className="font-mono text-sm font-semibold text-gray-900 mb-2">
                  {formatId(order.id)}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <HiOutlineCalendarDays className="w-3 h-3" />
                  {formatDateTime(order.createdAt).dateOnly}
                </div>
              </div>

              {/* Total Price */}
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">
                  Total
                </span>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </p>
              </div>

              {/* Payment Status */}
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">
                  Payment
                </span>
                <StatusBadge
                  isTrue={order.isPaid}
                  trueText="Paid"
                  falseText="Pending"
                  date={order.paidAt}
                />
              </div>

              {/* Delivery Status */}
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">
                  Delivery
                </span>
                <StatusBadge
                  isTrue={order.isDelivered}
                  trueText="Delivered"
                  falseText="In Transit"
                  date={order.deliveredAt}
                />
              </div>

              {/* Actions */}
              <div className="flex-center self-center">
                <Button variant="outline" size="lg">
                  <Link
                    href={`/order/${order.id}`}
                    className="flex items-center text-sm"
                  >
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {orders.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
