# React + TypeScript + Vite

✅ طراحی Liquid Glass (شیشه مایع) با افکت backdrop-blur
✅ ویدیو پس‌زمینه متحرک با fade-in/fade-out نرم
✅ افکت ستاره‌های چشمک‌زن در پس‌زمینه
✅ استفاده از فونت‌های سفارشی (Instrument Serif و Barlow)
✅ آیکون‌های مدرن با Lucide React
✅ طراحی کاملاً ریسپانسیو برای موبایل و دسکتاپ
✅ تم تاریک (Dark Mode) با المان‌های شفاف
✅ امنیت و اعتبارسنجی
✅ بررسی قدرت رمز عبور به صورت Real-time
✅ نوار پیشرفت رنگی برای نمایش سطح امنیت
✅ نمایش ۵ معیار امنیتی رمز (طول، حرف بزرگ، حرف کوچک، عدد، کاراکتر خاص)
✅ ۴ سطح قدرت: ضعیف، متوسط، خوب، قوی
✅ دکمه نمایش/مخفی کردن رمز عبور
✅ انیمیشن‌ها و تعاملات
✅ انیمیشن‌های روان با Framer Motion
✅ افکت Confetti (جشن) هنگام ورود موفق
✅ ترنزیشن نرم بین صفحات با AnimatePresence
✅ انیمیشن blur و scale برای ورود المان‌ها
✅   با آیکون چرخان
✅ افکت hover و tap روی دکمه‌ها
✅ عملکرد و UX
✅ فرم لاگین با اعتبارسنجی
✅ شبیه‌سازی پروسه لاگین
✅ صفحه موفقیت با نمایش اطلاعات کاربر
✅ دکمه خروج و بازگشت به صفحه لاگین
✅ مدیریت state با React Hooks

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
