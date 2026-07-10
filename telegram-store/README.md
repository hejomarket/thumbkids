# Kriuk & Teguk — Telegram Commerce MVP

Telegram Mini App untuk menjual snack dan minuman. Sudah berisi storefront, cart, checkout, simulasi tarif JNE/GoSend/GrabExpress, pilihan QRIS/VA/transfer, Telegram bot webhook, dan dashboard admin.

## Jalankan lokal

```bash
cd telegram-store
cp .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:3000` untuk toko dan `http://localhost:3000/admin` untuk admin.

Tanpa API key aplikasi berjalan dalam demo mode agar UI dapat langsung diuji.

## Deploy Vercel

1. Import repo ini ke Vercel.
2. Pilih Root Directory `telegram-store`.
3. Isi environment variables dari `.env.example`.
4. Deploy dan isi `APP_URL` dengan domain HTTPS hasil deploy.

## Hubungkan bot Telegram

Buat bot di BotFather, isi `TELEGRAM_BOT_TOKEN`, lalu daftarkan webhook ke:

`https://DOMAIN/api/telegram/webhook`

## Sebelum live

- Hubungkan PostgreSQL/Prisma agar order persisten.
- Isi Biteship API key dan origin Tangerang.
- Isi Xendit secret key serta callback token.
- Tambahkan autentikasi admin.
- Validasi seluruh webhook provider.
