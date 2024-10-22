// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const cavalliProductId = 'gid://shopify/Product/10260757053771';
  let cavalliInCart = false;

  // Проверяем, есть ли Cavalli в корзине
  for (const line of input.cart.lines) {
    if (line.merchandise.product.title.includes('Cavalli')) {
      cavalliInCart = true;
      break; // Если Cavalli найден, можем прекратить проверку
    }
  }

  // Если Cavalli отсутствует в корзине, не применяем скидку
  if (!cavalliInCart) {
    console.error("Cavalli product not in cart. No discount applied.");
    return EMPTY_DISCOUNT;
  }

  // Применяем скидку ко всем товарам, кроме Cavalli
  const targets = input.cart.lines
    .filter((line) => line.merchandise.product.title.includes('Cavalli'))
    .map((line) => {
      return /** @type {Target} */ ({
        cartLine: {
          id: line.id,
        },
      });
    });

  if (!targets.length) {
    console.error("No cart lines qualify for discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets,
        value: {
          percentage: {
            value: "10.0", 
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}

