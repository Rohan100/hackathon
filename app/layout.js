import localFont from "next/font/local";
import "./globals.css";
import "ol/ol.css";
import DataProvider from "./provider/DataProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en" >
    <DataProvider>
      <body className="h-full">
        {children}
      </body>
      </DataProvider>
    </html>
  );
}
