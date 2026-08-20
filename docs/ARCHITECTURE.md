# 🏗 Architecture — Learn with Mohanna

## نگاه کلی

```
┌─────────────────────────────────────┐
│          Frontend (Next.js)           │
│  Pages · Components · Contexts        │
│  Tailwind · RTL/LTR · Light/Dark      │
└─────────────────┬─────────────────┘
                  │ fetch()
┌─────────────────▼─────────────────┐
│       Backend (API Routes)            │
│  /api/auth/*   — signup, login, me   │
│  /api/words/*  — list, saved         │
│  /api/quizzes  — list, submit        │
│  /api/ai/*     — chat, history       │
│  /api/dashboard— aggregated stats    │
└─────────────────┬─────────────────┘
                  │ Prisma ORM
┌─────────────────▼─────────────────┐
│     Database (SQLite → Postgres)     │
│  User · Word · SavedWord · Quiz       │
│  QuizResult · AIConversation          │
│  CommunityPost                        │
└─────────────────────────────────────┘
```

## لایه‌ها

### ۱. Frontend

| مسیر | توضیح |
|------|--------|
| `src/pages/index.tsx` | صفحه اصلی (Hero + معرفی بخش‌ها) |
| `src/pages/dashboard.tsx` | داشبورد شخصی + مسیر یادگیری |
| `src/pages/words.tsx` | سیستم لغات تعاملی |
| `src/pages/dictionary.tsx` | دیکشنری |
| `src/pages/ai.tsx` | دستیار هوشمند فارسی‌محور |
| `src/pages/quizzes.tsx` | سیستم آزمون |
| `src/pages/community.tsx` | انجمن کاربران |
| `src/pages/movies.tsx` | فیلم و انیمیشن |
| `src/pages/profile.tsx` | پروفایل کاربر |
| `src/pages/settings.tsx` | تنظیمات |
| `src/pages/login.tsx` | ورود / ثبت‌نام |

### ۲. مدیریت وضعیت (Contexts)

- **`src/lib/ui-context.tsx`** — زبان (fa/en)، تم (light/dark)، RTL/LTR
- **`src/lib/auth-context.tsx`** — کاربر، توکن JWT، login/signup/logout

### ۳. Backend (API Routes)

تمام مسیرهای حمایت‌شده با JWT محافزت می‌شوند (`Authorization: Bearer <token>`).

| Endpoint | Method | Auth | توضیح |
|----------|--------|------|--------|
| `/api/auth/signup` | POST | ❌ | ساخت حساب |
| `/api/auth/login` | POST | ❌ | ورود |
| `/api/auth/me` | GET | ✅ | اطلاعات کاربر جاری |
| `/api/words` | GET | ❌ | لیست لغات (فیلتر: level, q) |
| `/api/words/saved` | GET/POST/DELETE | ✅ | لغات ذخیره‌شده |
| `/api/quizzes` | GET | ❌ | لیست آزمون‌ها |
| `/api/quizzes` | POST | ✅ | ثبت نتیجه + اعطای XP |
| `/api/ai/chat` | POST | ✅ | گفتگو با دستیار |
| `/api/ai/history` | GET | ✅ | تاریخچه گفتگوها |
| `/api/dashboard` | GET | ✅ | آمار تجمیعی |

### ۴. Database Schema

جداول اصلی در `prisma/schema.prisma`:

- **User** — اطلاعات کاربر، سطح، هدف، XP، streak
- **Word** — لغت با معنی فارسی، تلفظ، مثال دوزبانه
- **SavedWord** — لغات ذخیره‌شده کاربر
- **Quiz / QuizResult** — آزمون و نتایج
- **AIConversation** — تاریخچه گفتگوی AI
- **CommunityPost** — پیام‌های انجمن

## 🤖 منطق دستیار هوشمند

System prompt در `src/pages/api/ai/chat.ts` تعریف شده و قوانین زیر در آن تعبیه شده است:

1. همیشه فارسی جواب می‌دهد
2. کاربر را مجبور به انگلیسی صحبت کردن نمی‌کند
3. اشتباهات انگلیسی را اصلاح می‌کند و دلیل را فارسی توضیح می‌دهد
4. درخواست ترجمه → معادل انگلیسی + مثال + توضیح فارسی
5. لحن یک همراه یادگیری — نه یک معلم سختگیر

## 🎨 سیستم طراحی

توکن‌های رنگی در `src/styles/tokens.ts`:

- **Ocean Blue** `#0C8EE6` — رنگ اصلی
- **Coral** `#FF6B52` — رنگ مکمل
- **Light Mode** — سفید نرم `#F7FAFD`
- **Dark Mode** — آبی عمیق اقیانوسی `#04203C` (**نه مشکی کامل**)

## 🚀 توسعه آینده

ساختار پروژه برای افزودن موارد زیر آماده است:

- [ ] تولید درس لغت با AI
- [ ] تولید خودکار آزمون با AI
- [ ] سناریوی مکالمه با AI
- [ ] آپلود ویدیو و زیرنویس
- [ ] اعلان‌های Push
- [ ] مهاجرت به PostgreSQL
- [ ] پنل مدیریت انجمن
