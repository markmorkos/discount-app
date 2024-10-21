const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Позволяем серверу обрабатывать JSON запросы

// Маршрут для создания скидки
app.get('/apply-discount', (req, res) => {
  res.send('Discount creation page');
});

// Маршрут для отображения деталей скидки
app.get('/discount-details', (req, res) => {
  res.send('Discount details page');
});

// Логика применения скидок
app.post('/apply-discount', (req, res) => {
  const cavalliProductId = 'gid://shopify/Product/10260757053771'; // GID продукта Cavalli
  let cavalliInCart = false;
  let discounts = [];

  const cart = req.body.cart;

  for (const cartLine of cart.lines) {
    if (cartLine.merchandise.__typename === 'ProductVariant') {
      if (cartLine.merchandise.product.id === cavalliProductId) {
        cavalliInCart = true;
      } else {
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
              value: 10.0,
            },
          },
        });
      }
    }
  }

  res.json({
    discounts,
    discountApplicationStrategy: 'MAXIMUM',
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
