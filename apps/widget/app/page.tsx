import { subtract } from "@workspace/math/subtract";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Widget App</h1>
        <p>Subtraction: {subtract(30, 3)}</p>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
