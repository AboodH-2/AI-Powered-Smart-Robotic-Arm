import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ASL & RPS Game",
  description: "ASL Gesture Detection and Rock-Paper-Scissors Game",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
