// api/generate.js

module.exports = async function handler(req, res) {
  // التأكد من أن الطلب القادم هو من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  // جلب مفتاح الـ API من متغيرات البيئة المحمية في Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'مفتاح الـ API غير موجود في إعدادات Vercel.' }
    });
  }

  const { model, payload } = req.body || {};
  if (!model || !payload) {
    return res.status(400).json({ error: { message: 'بيانات الطلب غير مكتملة.' } });
  }

  try {
    // الاتصال بـ Gemini من داخل سيرفر Vercel الآمن
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await geminiResponse.json();
    
    // إرجاع النتيجة للواجهة الأمامية
    res.status(geminiResponse.status).json(data);
  } catch (error) {
    res.status(500).json({ error: { message: error.message || 'خطأ في الاتصال بالذكاء الاصطناعي.' } });
  }
}