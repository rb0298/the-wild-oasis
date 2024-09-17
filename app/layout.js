import Header from "./_components/Header";
import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import { ReservationProvider } from "./_components/ReservationContext";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: {
    template: "%s|The Wild Oasis",
    default: "Welcome|The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel located in the heart of the Italian Doli Dolomiter, surrounded by beautiful mountains and dark forests",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`text-primary-100 min-h-dvh bg-primary-950 ${josefin.className}
        flex flex-col antialiased`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid ">
          <main className="max-w-7x mx-auto  ">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
