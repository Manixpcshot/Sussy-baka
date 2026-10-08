# 🎮 Sussy Baka - بازی دوز آنلاین

یک بازی تخته **دوز (Tic Tac Toe)** مدرن، کامل و آنلاین با قابلیت‌های پیشرفته.

## ✨ ویژگی‌ها

### 🎯 حالت‌های بازی
- **بازی دو نفره محلی** - با دوستات روی یک دستگاه بازی کن
- **بازی با هوش مصنوعی** - ۴ سطح سختی (ساده، متوسط، سخت، غیرقابل شکست)
- **بازی آنلاین مولتی‌پلیر** - با بازیکنان از سراسر جهان (به زودی)

### 🤖 هوش مصنوعی پیشرفته
- الگوریتم **Minimax** با Alpha-Beta Pruning
- ۴ سطح سختی قابل انتخاب
- سطح "غيرقابل شکست" - همیشه برنده یا مساوی میشه

### 👤 سیستم کاربری
- ثبت‌نام/ورود با ایمیل و رمز عبور
- احراز هویت با **GitHub** و **Google** (OAuth)
- پروفایل کاربری با آمار و تاریخچه
- سیستم رتبه‌بندی (ELO Rating)

### 🏆 سیستم امتیاز و رتبه
- امتیازدهی بر اساس نتیجه بازی
- رتبه‌بندی جهانی (Leaderboard)
- مدال‌ها و دستاوردها
- تاریخچه کامل بازی‌ها

### 🎨 رابط کاربری
- طراحی مدرن و ریسپانسیو
- تم تیره/روشن
- انیمیشن‌های روان
- پشتیبانی کامل از RTL و زبان فارسی
- موبایل فرندلی

### ⚡ تکنولوژی‌ها
- **Frontend:** Vanilla JavaScript + Vite
- **Backend/Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Real-time:** Supabase Realtime برای مولتی‌پلیر
- **Deploy:** Vercel / Netlify

## 🚀 نصب و اجرا

### پیش‌نیازها
- Node.js 18+
- حساب Supabase (رایگان)

### مراحل نصب

```bash
# کلون کردن مخزن
git clone https://github.com/Manixpcshot/Sussy-baka.git
cd Sussy-baka

# نصب وابستگی‌ها
npm install

# کپی کردن فایل محیطی
cp .env.example .env
# فایل .env رو ویرایش کن و کلیدهای Supabase رو وارد کن

# اجرای سرور توسعه
npm run dev
```

### تنظیم Supabase

1. در [Supabase](https://supabase.com) یک پروژه جدید بساز
2. به Settings > API برو و کلیدها رو کپی کن
3. در فایل `.env` قرار بده:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. در Supabase Dashboard به Authentication > Providers برو و GitHub/Google رو فعال کن
5. در Database > Tables جداول مورد نیاز رو بساز (یا از migrationها استفاده کن)

## 📁 ساختار پروژه

```
Sussy-baka/
├── index.html          # صفحه اصلی
├── style.css           # استایل‌ها
├── script.js           # منطق اصلی بازی
├── js/
│   ├── auth.js         # مدیریت احراز هویت
│   ├── game.js         # منطق بازی دوز
│   ├── ai.js           # هوش مصنوعی (Minimax)
│   ├── multiplayer.js  # بازی آنلاین
│   ├── profile.js      # پروفایل و آمار
│   └── leaderboard.js  # رتبه‌بندی
├── css/
│   ├── components.css  # استایل کامپوننت‌ها
│   └── animations.css  # انیمیشن‌ها
├── supabase/
│   └── migrations/     # مهاجرتهای دیتابیس
├── .env.example        # نمونه فایل محیطی
├── package.json
├── vite.config.js
└── README.md
```

## 🎮 نحوه بازی

1. **حالت محلی:** روی "بازی دو نفره" کلیک کن و با دوستت بازی کن
2. **با AI:** سطح سختی رو انتخاب کن و با ربات بازی کن
3. **آنلاین:** وارد حساب کاربری شو، در صف بازی بپیوست

## 🤝 مشارکت

1. Fork کن
2. Branch جدید بساز (`git checkout -b feature/amazing-feature`)
3. تغییراتت رو Commit کن (`git commit -m 'Add amazing feature'`)
4. Push کن (`git push origin feature/amazing-feature`)
5. Pull Request باز کن

## 📄 لایسنس

MIT License - آزاد برای استفاده، تغییر و توزیع.

## 🙏 تشکر

- [Supabase](https://supabase.com) برای بک‌اند قدرتمند و رایگان
- [Vite](https://vitejs.dev) برای بیلد سریع
- تمام مشارکت‌کنندگان

---

**ساخته شده با ❤️ توسط جامعه اوپن‌سورس**