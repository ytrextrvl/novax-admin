# NOVAX Admin - دليل النشر (Deployment Guide)

> **آخر تحديث:** 2025-12-19

---

## 1. المتطلبات

- Node.js 18+
- pnpm
- حساب Vercel
- متغيرات البيئة مُعدة

---

## 2. النشر على Vercel

### الخطوات:

1. **ربط المستودع:**
   - ادخل Vercel Dashboard
   - Import Git Repository
   - اختر `novax-admin`

2. **إعداد المتغيرات:**
   - Settings → Environment Variables
   - أضف المتغيرات من `.env.example`

3. **النشر:**
   - يتم تلقائياً عند Push لـ main

---

## 3. التحقق بعد النشر

| الخطوة | الإجراء |
|--------|---------|
| 1 | افتح https://admin.novaxtravel.com |
| 2 | تأكد من ظهور صفحة تسجيل الدخول |
| 3 | جرب تسجيل الدخول |

---

## 4. خطة التراجع

راجع [ROLLBACK.md](./ROLLBACK.md)

---

## 5. البيئات

| البيئة | الرابط | الغرض |
|--------|--------|-------|
| Production | admin.novaxtravel.com | الإنتاج |
| Preview | *.vercel.app | معاينة PRs |

---

> **آخر تحديث:** 2025-12-19
