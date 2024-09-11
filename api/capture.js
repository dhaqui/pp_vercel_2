const paypal = require('@paypal/checkout-server-sdk');

// PayPalの環境設定
const environment = new paypal.core.SandboxEnvironment(
  'AV3P5knBPhPGwS7EDayvKulircVel0n9adwODe6qRp1-0vp2pZ2DRaOa0kegvAwQYlJ4K_C78v3RduCG',
  'EATQXaVnsOagF0rvsfzZwaSmk_040HeX1t2aOrLjOOjx2LlCGVCjdJwaQUJ_9rCpI4vYCFDaM2sn3fPb'
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = async (req, res) => {
  const { token } = req.query;  // クエリパラメータからtoken（注文ID）を取得

  if (!token) {
    return res.status(400).json({ error: 'Missing token parameter' });
  }

  console.log(`Received request to capture order with token: ${token}`); // デバッグ用ログ

  try {
    // CAPTUREリクエストの送信（tokenを使用）
    const request = new paypal.orders.OrdersCaptureRequest(token);
    const capture = await client.execute(request);

    console.log('Capture result:', capture); // デバッグ用ログ

    if (capture.statusCode === 201) {
      // 決済成功時のレスポンス
      res.status(200).json({ status: capture.result.status });
    } else {
      // PayPal APIがエラーを返した場合
      console.error('Capture failed with status:', capture.statusCode, capture.result);
      res.status(500).json({
        error: 'Failed to capture order',
        details: capture.result
      });
    }
  } catch (error) {
    // エラー処理
    console.error('Error capturing payment:', error);

    // エラーの詳細を返す
    if (error.response) {
      // PayPal APIがエラーを返した場合
      const errorDetails = error.response;
      res.status(500).json({
        error: 'PayPal API error occurred while capturing the payment',
        details: errorDetails
      });
    } else {
      // それ以外のシステムエラー
      res.status(500).json({ error: 'An unknown error occurred while capturing the payment' });
    }
  }
};
