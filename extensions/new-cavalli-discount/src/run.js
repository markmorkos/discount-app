// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

export default function applyDiscountFunction(input) {
  const cavalliProductId = 'gid://shopify/Product/10260757053771'; // Замените на ваш реальный GID продукта Cavalli
  let cavalliInCart = false;

  // Проверяем, есть ли продукт Cavalli в корзине
  for (const cartLine of input.cart.lines) {
    if (cartLine.merchandise.__typename === 'ProductVariant') {
      if (cartLine.merchandise.product.id === cavalliProductId) {
        cavalliInCart = true;
        break;
      }
    }
  }

  if (cavalliInCart) {
    const discounts = [];

    // Если Cavalli найден, применяем скидку ко всем другим товарам
    for (const cartLine of input.cart.lines) {
      if (
        cartLine.merchandise.__typename === 'ProductVariant' &&
        cartLine.merchandise.product.id !== cavalliProductId
      ) {
        discounts.push({
          message: 'Discount 10%',
          targets: [
            {
              productVariant: {
                id: cartLine.merchandise.id,
              },
            },
          ],
          value: {
            percentage: {
              value: 10.0, // Процент скидки
            },
          },
        });
      }
    }

    return {
      discounts,
      discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    };
  }

  // Если продукта Cavalli нет в корзине, скидка не применяется
  return {
    discounts: [],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
