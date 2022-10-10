import { useCheckout } from "@lib/context/checkout-context"
import Button from "@modules/common/components/button"
import Checkbox from "@modules/common/components/checkbox"
import Spinner from "@modules/common/icons/spinner"
import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"

const Addresses = () => {
  const {
    sameAsBilling: { state: checked, toggle: onChange },
    editAddresses: { state: isEdit, toggle: setEdit },
    setAddresses,
    handleSubmit,
    cart,
  } = useCheckout()
  return (
    <div className="bg-white">
      {isEdit ? (
        <div className="px-8 pb-8">
          <ShippingAddress />
          <div className="mt-6">
            <Checkbox
              label="Same as billing address"
              checked={checked}
              onChange={onChange}
            />
          </div>
          {!checked && (
            <div>
              <div className="text-xl flex items-center gap-x-4 pb-6 pt-8 text-gray-500">
                <h2>Billing address</h2>
              </div>
              <BillingAddress />
            </div>
          )}
          <Button
            className="max-w-[200px] mt-6 hover:bg-white bg-pink-500 text-white hover:text-pink-500 border-pink-500 ml-auto"
            onClick={handleSubmit(setAddresses)}
          >
            下一步
          </Button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 px-8 py-6 text-small-regular">
            {cart && cart.shipping_address ? (
              <div>
                <div className="text-xl flex items-center gap-x-4 pb-4 text-gray-500">
                  顧客資料 Client Information
                </div>
                <div className="flex items-start gap-x-8">
                  <div className="bg-green-400 rounded-full min-w-[24px] h-6 flex items-center justify-center text-white text-small-regular">
                    ✓
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col">
                      <span>
                        {cart.shipping_address.first_name}{" "}
                        {cart.shipping_address.last_name}
                      </span>
                      <span>
                        {cart.shipping_address.address_1}{" "}
                        {cart.shipping_address.address_2}
                      </span>
                      <span>
                        {cart.shipping_address.postal_code},{" "}
                        {cart.shipping_address.city}
                      </span>
                      <span>
                        {cart.shipping_address.country_code?.toUpperCase()}
                      </span>
                      <div className="mt-4 flex flex-col">
                        <span>{cart.shipping_address.phone}</span>
                        <span>{cart.email}</span>
                      </div>
                      {checked && (
                        <div className="flex items-center gap-x-2 mt-6">
                          <div className="flex items-center justify-center border border-gray-700 bg-gray-100 w-4 h-4">
                            ✓
                          </div>
                          <span>Same as billing address</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <button onClick={setEdit}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <Spinner />
              </div>
            )}
          </div>
          {!checked && (
            <div>
              <div className="text-xl flex items-center gap-x-4 px-8 pb-6 pt-8 text-gray-500">
                <h2>Billing address</h2>
              </div>
              <div className="bg-gray-50 px-8 py-6 text-small-regular">
                {cart && cart.billing_address ? (
                  <div>
                    <div className="text-xl flex items-center gap-x-4 pb-4 text-gray-500">
                      送貨資料 Shipping Information
                    </div>
                    <div className="flex items-start gap-x-8">
                      <div className="bg-green-400 rounded-full min-w-[24px] h-6 flex items-center justify-center text-white text-small-regular">
                        ✓
                      </div>
                      <div className="flex items-start justify-between w-full">
                        <div className="flex flex-col">
                          <span>
                            {cart.billing_address.first_name}{" "}
                            {cart.billing_address.last_name}
                          </span>
                          <span>
                            {cart.billing_address.address_1}{" "}
                            {cart.billing_address.address_2}
                          </span>
                          <span>
                            {cart.billing_address.postal_code},{" "}
                            {cart.billing_address.city}
                          </span>
                          <span>
                            {cart.billing_address.country_code?.toUpperCase()}
                          </span>

                          <div className="mt-4 flex flex-col">
                            <span>{cart.billing_address.phone}</span>
                          </div>
                        </div>
                        <div>
                          <button onClick={setEdit}>Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <Spinner />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
