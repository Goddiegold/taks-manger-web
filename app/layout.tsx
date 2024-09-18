import { Inter } from 'next/font/google'
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Task Manager',
  description: 'Tool for team to manage tasks within the organization',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="icon"
          href="/logo-resize.png"
          type="image/png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={inter.variable}>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

