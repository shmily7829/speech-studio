import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Speech Studio · 演講練習室',description:'雙語講稿、逐段背誦、朗讀與計時。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}
