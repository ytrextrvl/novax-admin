# NOVAX Admin - Security Baseline

> **آخر تحديث:** 2025-12-20

---

## نظرة عامة

لوحة تحكم الإدارة (Next.js) للوصول المحدود للمسؤولين فقط.

---

## نموذج المصادقة

### JWT من Backend
- التوكن يُخزن في HTTP-only cookie
- التحقق عبر Backend API
- انتهاء الجلسة: 24 ساعة

### الصلاحيات المطلوبة
- `admin` أو `super_admin` فقط
- التحقق من الصلاحية في كل طلب

---

## Security Headers

### الحالة الحالية: مخطط للتنفيذ

### Headers المطلوبة:
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

### CSP (Content Security Policy):
- **الحالة:** يحتاج اختبار قبل التفعيل
- **السبب:** قد يكسر وظائف موجودة

---

## إدارة الأسرار

### القواعد:
- ✅ `.env.local` لا يُرفع لـ Git
- ✅ `.env.example` بقيم وهمية
- ✅ Vercel Environment Variables للإنتاج
- ❌ ممنوع hardcode للأسرار

### المتغيرات الحساسة:
- `NEXT_PUBLIC_API_URL` (ليس سري)
- `API_SECRET_KEY` (سري - Backend فقط)

---

## حماية المدخلات

### Client-side:
- تحقق من النماذج قبل الإرسال
- تنظيف المدخلات

### Server-side (API Routes):
- التحقق في Backend
- Rate limiting في Backend

---

## المخاطر المعروفة

| المخاطر | الخطورة | الحالة | التخفيف |
|---------|---------|--------|---------|
| Security headers غير مفعلة | MEDIUM | مخطط | Phase 5 |
| CSP غير مفعل | LOW | مخطط | يحتاج اختبار |

---

> **آخر تحديث:** 2025-12-20
