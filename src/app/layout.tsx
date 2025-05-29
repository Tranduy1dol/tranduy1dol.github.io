import React from "react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const header = (
        <header>
            <div>
                <Link href={"/"}>
                    <h1>Blog</h1>
                </Link>
                <p>Welcome</p>
                <br/>
            </div>
        </header>
    )

    const footer = (
        <footer>
            <div>
                <p>Copyright</p>
            </div>
        </footer>
    )

    return (
    <html lang="en">
        <body>
            {header}
            {children}
            {footer}
        </body>
    </html>
  );
}
