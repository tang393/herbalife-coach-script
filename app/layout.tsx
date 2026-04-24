import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coach Herbalife – Công cụ tạo kịch bản tư vấn',
  description:
    'Nhập dữ liệu cơ thể khách hàng, tạo ngay kịch bản tư vấn + 3 gói sản phẩm + hành động tiếp theo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
