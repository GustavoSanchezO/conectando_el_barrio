import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Conectando el Barrio — Catálogo de Comercios Locales de Durango",
  description:
    "Descubre y registra negocios locales de Durango. Registra tu comercio con IA por voz y explora rutas de consumo local para turistas y ciudadanos.",
  keywords: "Durango, comercios locales, turismo, barrio, México, negocios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏘️</text></svg>" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
