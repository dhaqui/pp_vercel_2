const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定
const environment = new paypal.core.SandboxEnvironment(
  'AV3P5knBPhPGwS7EDayvKulircVel0n9adwODe6qRp1-0vp2pZ2DRaOa0kegvAwQYlJ4K_C78v3RduCG',
  'EATQXaVnsOagF0rvsfzZwaSmk_040HeX1t2aOrLjOOjx2LlCGVCjdJwaQUJ_9rCpI4vYCFDaM2sn3fPb'
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = async (req, res) => {
  const { token } = req.query;  // クエリパラメータからtoken（注文ID）を取得
  console.log(`Received request to capture order with token: ${token}`); // デバッグ用ログ

  try {
    // CAPTUREリクエストの送信（tokenを使用）
    const request = new paypal.orders.OrdersCaptureRequest(token);
    const capture = await client.execute(request);

    console.log('Capture result:', capture); // デバッグ用ログ

    // 決済のステータスを返す
    res.status(200).json({ status: capture.result.status });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ error: 'An error occurred while capturing the payment' });
  }
};
