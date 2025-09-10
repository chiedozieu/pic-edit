import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import FloatingShapes from "@/components/floating-shapes";
import Header from "@/components/header";
import { ModeToggle } from "@/components/theme-toggle";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism, shadesOfPurple} from "@clerk/themes";


const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "PicEdit",
  description: "Ai image editor",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: [dark, neobrutalism ]}}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <main className="bg-slate-900 min-h-screen overflow-x-hidden">
                <div className="fixed top-6 right-6 z-50">
                  <ModeToggle />
                </div>
                <Header />
                <FloatingShapes />
                <Toaster richColors />
                {children}
              </main>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
