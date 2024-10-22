// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const cavalliProductId = 'gid://shopify/Product/10260757053771'; // GID продукта Cavalli
  let cavalliInCart = false;

  // Проверяем, есть ли Cavalli в корзине
  for (const line of input.cart.lines) {
    if (line.merchandise.__typename === 'ProductVariant' && line.merchandise.product.id === cavalliProductId) {
      cavalliInCart = true;
      break; // Если Cavalli найден, прекращаем проверку
    }
  }

  // Если Cavalli отсутствует в корзине, не изменяем существующие скидки
  if (!cavalliInCart) {
    console.log("Cavalli product not in cart. Proceed with regular discounts.");
    return EMPTY_DISCOUNT;
  }

  // Если Cavalli присутствует, исключаем его из всех скидок
  const targets = input.cart.lines
    .filter((line) => {
      return (
        line.merchandise.__typename === 'ProductVariant' &&
        line.merchandise.product.id === cavalliProductId // Исключаем Cavalli из таргетов для скидки
      );
    })
    .map((line) => {
      return /** @type {Target} */ ({
        cartLine: {
          id: line.id,  // Оставляем скидку только для этих строк корзины
        },
      });
    });

  if (targets.length > 0) {
    return {
      discounts: [
        {
          // Оставляем скидку только для всех таргетов, кроме Cavalli
          targets,
          value: {
            percentage: {
              // Не меняем процент скидки, оставляем то, что было в корзине
              value: 0, // Сохраняем существующие скидки
            },
          },
        },
      ],
      discountApplicationStrategy: DiscountApplicationStrategy.Maximum,  // Оставляем максимальные скидки
    };
  }

  // Если все товары в корзине — это Cavalli, скидка не применяется
  console.log("No eligible products for discount.");
  return EMPTY_DISCOUNT;
}
