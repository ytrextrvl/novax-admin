# NOVAX Admin - مرجع متغيرات البيئة

> **آخر تحديث:** 2025-12-19

---

## المتغيرات المطلوبة

| المتغير | الوصف | مثال | مطلوب |
|---------|-------|------|-------|
| `NEXT_PUBLIC_API_URL` | رابط API Backend | `https://api.novaxtravel.com/api` | ✅ |

---

## ملاحظات

- **لا تضع أسرار في الكود**
- المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` تكون مرئية في المتصفح
- الأسرار يجب أن تكون في Vercel Environment Variables فقط

---

## الإعداد في Vercel

1. Settings → Environment Variables
2. أضف كل متغير
3. اختر البيئة (Production/Preview/Development)

---

> **آخر تحديث:** 2025-12-19
