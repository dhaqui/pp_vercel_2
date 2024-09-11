const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定
const environment = new paypal.core.SandboxEnvironment(
  'AV3P5knBPhPGwS7EDayvKulircVel0n9adwODe6qRp1-0vp2pZ2DRaOa0kegvAwQYlJ4K_C78v3RduCG',
  'EATQXaVnsOagF0rvsfzZwaSmk_040HeX1t2aOrLjOOjx2LlCGVCjdJwaQUJ_9rCpI4vYCFDaM2sn3fPb'
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { items } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    const totalAmount = items.reduce((total, item) => total + item.price, 0);

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'JPY',
            value: totalAmount.toString()
          }
        }
      ],
      application_context: {
        return_url: 'https://pp-vercel.vercel.app/redirect.html',  // 決済成功後のリダイレクト先URL
        cancel_url: 'https://pp-vercel.vercel.app/cancel.html'   // キャンセル後のリダイレクト先URL
      }
    });

    try {
      const order = await client.execute(request);
      res.status(200).json(order.result);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'An error occurred while creating the order' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
