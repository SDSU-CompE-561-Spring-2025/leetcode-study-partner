import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function Matchmaking() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Matchmaking - Select Preferences</h2>

      <Card className="w-full max-w-3xl p-6 bg-card rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Languages Card */}
          <Card className="flex-1">
            <CardHeader>
              <h3 className="text-lg font-semibold">Languages</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Checkboxes here */}
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card className="flex-1">
            <CardHeader>
              <h3 className="text-lg font-semibold">Categories</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Checkboxes here */}
            </CardContent>
          </Card>
        </div>

        <Button className="mt-6 w-full md:w-auto self-center">Begin</Button>
      </Card>
    </div>
  );
}

