import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import ShiftInput from "./ShiftInput";
import ResultsDisplay from "./ResultsDisplay";
import PredictiveAnalytics from "./PredictiveAnalytics";

interface ShiftCategory {
  label: string;
  hoursPerShift: number;
  testId: string;
}

const WEEKDAY_SHIFTS: ShiftCategory[] = [
  { label: "Service Weekday", hoursPerShift: 10, testId: "input-service-weekday" },
  { label: "4th Attending Weekday", hoursPerShift: 2.5, testId: "input-4th-attending-weekday" },
  { label: "Jeopardy Weekday", hoursPerShift: 2.5, testId: "input-jeopardy-weekday" },
  { label: "Call Night", hoursPerShift: 16, testId: "input-call-night-weekday" },
];

const WEEKEND_SHIFTS: ShiftCategory[] = [
  { label: "Service Weekend Day", hoursPerShift: 10, testId: "input-service-weekend" },
  { label: "4th Attending Weekend Day", hoursPerShift: 2.5, testId: "input-4th-attending-weekend" },
  { label: "Jeopardy Weekend Day", hoursPerShift: 2.5, testId: "input-jeopardy-weekend" },
  { label: "Call Night", hoursPerShift: 16, testId: "input-call-night-weekend" },
];

const CONVERSION_SHIFTS: ShiftCategory[] = [
  { label: "Jeopardy", hoursPerShift: 10, testId: "input-jeopardy-conversion" },
  { label: "4th Attending", hoursPerShift: 10, testId: "input-4th-attending-conversion" },
];

const JOHN_MUIR_SHIFTS: ShiftCategory[] = [
  { label: "Shift", hoursPerShift: 12, testId: "input-john-muir-shift" },
];

const FULL_TIME_ANNUAL_HOURS = 1750;

export default function ShiftCalculator() {
  const [fte, setFte] = useState<number>(1.0);
  const [weekdayShifts, setWeekdayShifts] = useState<number[]>([0, 0, 0, 0]);
  const [weekendShifts, setWeekendShifts] = useState<number[]>([0, 0, 0, 0]);
  const [conversionShifts, setConversionShifts] = useState<number[]>([0, 0]);
  const [johnMuirShifts, setJohnMuirShifts] = useState<number[]>([0]);

  const updateWeekdayShift = (index: number, value: number) => {
    const newShifts = [...weekdayShifts];
    newShifts[index] = value;
    setWeekdayShifts(newShifts);
  };

  const updateWeekendShift = (index: number, value: number) => {
    const newShifts = [...weekendShifts];
    newShifts[index] = value;
    setWeekendShifts(newShifts);
  };

  const updateConversionShift = (index: number, value: number) => {
    const newShifts = [...conversionShifts];
    newShifts[index] = value;
    setConversionShifts(newShifts);
  };

  const updateJohnMuirShift = (index: number, value: number) => {
    const newShifts = [...johnMuirShifts];
    newShifts[index] = value;
    setJohnMuirShifts(newShifts);
  };

  const handleReset = () => {
    setFte(1.0);
    setWeekdayShifts([0, 0, 0, 0]);
    setWeekendShifts([0, 0, 0, 0]);
    setConversionShifts([0, 0]);
    setJohnMuirShifts([0]);
  };

  const handleFteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFte(isNaN(val) || val < 0 ? 0 : val);
  };

  const breakdown = [
    ...WEEKDAY_SHIFTS.map((shift, index) => ({
      category: shift.label,
      shifts: weekdayShifts[index],
      hoursPerShift: shift.hoursPerShift,
      totalHours: weekdayShifts[index] * shift.hoursPerShift,
    })),
    ...WEEKEND_SHIFTS.map((shift, index) => ({
      category: shift.label,
      shifts: weekendShifts[index],
      hoursPerShift: shift.hoursPerShift,
      totalHours: weekendShifts[index] * shift.hoursPerShift,
    })),
    ...CONVERSION_SHIFTS.map((shift, index) => ({
      category: shift.label,
      shifts: conversionShifts[index],
      hoursPerShift: shift.hoursPerShift,
      totalHours: conversionShifts[index] * shift.hoursPerShift,
    })),
    ...JOHN_MUIR_SHIFTS.map((shift, index) => ({
      category: shift.label,
      shifts: johnMuirShifts[index],
      hoursPerShift: shift.hoursPerShift,
      totalHours: johnMuirShifts[index] * shift.hoursPerShift,
    })),
  ];

  const totalHours = breakdown.reduce((sum, item) => sum + item.totalHours, 0);
  const expectedAnnualHours = fte * FULL_TIME_ANNUAL_HOURS;
  const remainingHours = Math.max(0, expectedAnnualHours - totalHours);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">PCCM Clinical Work Calculator</h1>
          <p className="text-muted-foreground">Calculate total hours worked across shift types and predict future assignments to reach cFTE goal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">FTE Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,140px] gap-2 md:gap-4 items-start md:items-center">
              <div className="space-y-1">
                <Label htmlFor="input-fte" className="text-sm font-medium text-foreground">
                  Full Time Equivalent (FTE)
                </Label>
                <p className="text-xs text-muted-foreground">
                  {FULL_TIME_ANNUAL_HOURS} hrs/year at 1.0 FTE
                </p>
              </div>
              <Input
                id="input-fte"
                data-testid="input-fte"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={fte || ''}
                onChange={handleFteChange}
                placeholder="1.0"
                className="text-base font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Weekday Shifts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {WEEKDAY_SHIFTS.map((shift, index) => (
                <ShiftInput
                  key={shift.testId}
                  label={shift.label}
                  value={weekdayShifts[index]}
                  onChange={(value) => updateWeekdayShift(index, value)}
                  hoursPerShift={shift.hoursPerShift}
                  testId={shift.testId}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Weekend Shifts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {WEEKEND_SHIFTS.map((shift, index) => (
                <ShiftInput
                  key={shift.testId}
                  label={shift.label}
                  value={weekendShifts[index]}
                  onChange={(value) => updateWeekendShift(index, value)}
                  hoursPerShift={shift.hoursPerShift}
                  testId={shift.testId}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Jeopardy and 4th Attending Conversions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONVERSION_SHIFTS.map((shift, index) => (
                <ShiftInput
                  key={shift.testId}
                  label={shift.label}
                  value={conversionShifts[index]}
                  onChange={(value) => updateConversionShift(index, value)}
                  hoursPerShift={shift.hoursPerShift}
                  testId={shift.testId}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">John Muir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {JOHN_MUIR_SHIFTS.map((shift, index) => (
                <ShiftInput
                  key={shift.testId}
                  label={shift.label}
                  value={johnMuirShifts[index]}
                  onChange={(value) => updateJohnMuirShift(index, value)}
                  hoursPerShift={shift.hoursPerShift}
                  testId={shift.testId}
                />
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <ResultsDisplay 
          breakdown={breakdown} 
          totalHours={totalHours}
          expectedAnnualHours={expectedAnnualHours}
        />

        <PredictiveAnalytics remainingHours={remainingHours} />
      </div>
    </div>
  );
}
