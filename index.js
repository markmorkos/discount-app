const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Пример простой логики для Shopify Function Discounts
app.post('/apply-discount', (req, res) => {
  const cavalliProductId = 'gid://shopify/Product/10260757053771'; // Замените на ваш реальный GID продукта Cavalli
  let cavalliInCart = false;
  let discounts = [];

  // Пример проверки товаров в корзине
  const cart = req.body.cart; // Здесь должно быть тело запроса с данными корзины
  for (const cartLine of cart.lines) {
    if (cartLine.merchandise.__typename === 'ProductVariant') {
      if (cartLine.merchandise.product.id === cavalliProductId) {
        cavalliInCart = true;
      } else {
        // Применяем скидку ко всем товарам, кроме Cavalli
        discounts.push({
          message: '10% Discount applied',
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
  }

  // Возвращаем результат применения скидки
  res.json({
    discounts,
    discountApplicationStrategy: 'MAXIMUM',
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
