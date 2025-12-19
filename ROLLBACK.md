# NOVAX Admin - خطوات التراجع (Rollback)

> **آخر تحديث:** 2025-12-19

---

## التراجع عبر Vercel

### الخطوات:

1. **ادخل Vercel Dashboard**
2. **اختر مشروع novax-admin**
3. **Deployments → اختر deployment سابق**
4. **اضغط "Promote to Production"**

---

## التراجع عبر Git

```bash
# عرض آخر commits
git log --oneline -10

# التراجع لـ commit معين
git revert <commit-hash>
git push origin main
```

---

## في حالة الطوارئ

1. تراجع فوري عبر Vercel
2. أبلغ الفريق
3. وثق الحادثة في SECURITY.md

---

> **آخر تحديث:** 2025-12-19
