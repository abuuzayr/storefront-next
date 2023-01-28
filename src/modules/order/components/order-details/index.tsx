import { Order } from "@medusajs/medusa"

type OrderDetailsProps = {
  order: Order
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const items = order.items.reduce((acc, i) => acc + i.quantity, 0)

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="p-4 md:p-10 border-b border.gray-200">
      <span className="text-gray-700 text-small-regular uppercase">
        多謝付款，你的貨品已成功購買！
      </span>
      <h1 className="mt-2 uppercase text-2xl-semi">#{order.display_id} 訂單</h1>
      <span>{order.id.split("order_")[1]}</span>
      <div className="flex items-center text-gray-700 text-small-regular gap-x-4 mt-4">
        <span>{new Date(order.created_at).toDateString()}</span>
        <span>{`${items} 貨品`}</span>
        {showStatus && (
          <>
            <span>{formatStatus(order.fulfillment_status)}</span>
            <span>{formatStatus(order.payment_status)}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
