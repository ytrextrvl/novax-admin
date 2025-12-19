# NOVAX Admin Panel

> لوحة تحكم الإدارة لمنصة NOVAX TRAVEL

---

## ما هو هذا المشروع؟

هذه لوحة تحكم الإدارة لمنصة NOVAX TRAVEL، مبنية باستخدام Next.js 16 مع React 19.

توفر:
- إدارة المستخدمين والصلاحيات
- إدارة الرحلات والحجوزات
- إدارة الأسعار والعمولات
- إدارة الوكالات
- التقارير والإحصائيات
- سجلات التدقيق

---

## التقنيات

| التقنية | الإصدار |
|---------|---------|
| Next.js | 16.0.10 |
| React | 19.2.3 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.1.18 |

---

## خطوات التحقق (للمالك غير التقني)

### 1. التحقق من أن اللوحة تعمل:
```
افتح في المتصفح: https://admin.novaxtravel.com
يجب أن ترى صفحة تسجيل الدخول
```

### 2. التحقق من لوحة Vercel:
```
1. ادخل إلى vercel.com/dashboard
2. ابحث عن مشروع novax-admin
3. تأكد أن Status = "Ready"
```

---

## الإعداد المحلي

```bash
pnpm install
pnpm dev
```

افتح http://localhost:3000 في المتصفح.

---

## البناء والنشر

```bash
pnpm build
pnpm start
```

النشر على Vercel يتم تلقائياً عند Push لـ main.

---

## الملفات المهمة

| الملف | الغرض |
|-------|-------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | خطوات النشر |
| [ENV_VARIABLES_REFERENCE.md](./ENV_VARIABLES_REFERENCE.md) | متغيرات البيئة |
| [ROLLBACK.md](./ROLLBACK.md) | خطوات التراجع |
| [SECURITY.md](./SECURITY.md) | سياسات الأمان |
| [CHECKLIST.md](./CHECKLIST.md) | قائمة المهام |

---

## الروابط

- **Admin Panel:** https://admin.novaxtravel.com
- **API Backend:** https://api.novaxtravel.com

---

> **آخر تحديث:** 2025-12-19
