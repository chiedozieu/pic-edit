import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-4">
     <h2>hello world </h2>
     <ModeToggle />
     <Button variant="glass">Click Me</Button>
     <Button variant="primary" size="xl">Click Me</Button>
    </div>
  );
}
