import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ShiftInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hoursPerShift: number;
  testId: string;
}

export default function ShiftInput({ label, value, onChange, hoursPerShift, testId }: ShiftInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,140px] gap-2 md:gap-4 items-start md:items-center">
      <div className="space-y-1">
        <Label htmlFor={testId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">
          {hoursPerShift} hrs/shift
        </p>
      </div>
      <Input
        id={testId}
        data-testid={testId}
        type="number"
        min="0"
        step="1"
        value={value || ''}
        onChange={handleChange}
        placeholder="0"
        className="text-base font-mono"
      />
    </div>
  );
}
