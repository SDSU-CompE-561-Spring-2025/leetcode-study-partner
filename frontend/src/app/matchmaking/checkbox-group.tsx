import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  title: string;
  options: string[];
  idPrefix?: string; // Add idPrefix prop
}

export function CheckboxGroup({ title, options, idPrefix }: CheckboxGroupProps) {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>

      <CardContent className="flex-1">
        <ScrollArea className="h-64 md:h-80 lg:h-[30vh] p-3 pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, i) => {
              const id = `${idPrefix || 'checkbox'}-${i}`; // Use idPrefix if provided
              return (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox id={id} />
                  <span className="text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
