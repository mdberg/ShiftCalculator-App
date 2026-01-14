import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";

interface PredictiveAnalyticsProps {
  remainingHours: number;
}

interface ShiftValues {
  serviceWeek: number;
  serviceWeekend: number;
  jeopardyWeek: number;
  jeopardyWeekend: number;
  callNight: number;
  johnMuir: number;
}

const SHIFT_HOURS = {
  serviceWeek: 50,
  serviceWeekend: 20,
  jeopardyWeek: 12.5,
  jeopardyWeekend: 5,
  callNight: 16,
  johnMuir: 12,
};

export default function PredictiveAnalytics({ remainingHours }: PredictiveAnalyticsProps) {
  const [shifts, setShifts] = useState<ShiftValues>({
    serviceWeek: 0,
    serviceWeekend: 0,
    jeopardyWeek: 0,
    jeopardyWeekend: 0,
    callNight: 0,
    johnMuir: 0,
  });

  // Calculate initial suggestions based on remaining hours
  const calculateInitialSuggestions = (remaining: number): ShiftValues => {
    if (remaining <= 0) {
      return { serviceWeek: 0, serviceWeekend: 0, jeopardyWeek: 0, jeopardyWeekend: 0, callNight: 0, johnMuir: 0 };
    }

    let leftover = remaining;

    // Allocate Service Week and Service Weekend equally in cycles
    const serviceCycleHours = SHIFT_HOURS.serviceWeek + SHIFT_HOURS.serviceWeekend; // 70
    const fullCycles = Math.floor(leftover / serviceCycleHours);
    const serviceWeek = fullCycles;
    const serviceWeekend = fullCycles;
    leftover -= fullCycles * serviceCycleHours;

    // Allocate Jeopardy Week
    const jeopardyWeek = Math.floor(leftover / SHIFT_HOURS.jeopardyWeek);
    leftover -= jeopardyWeek * SHIFT_HOURS.jeopardyWeek;

    // Allocate Call Night
    const callNight = Math.floor(leftover / SHIFT_HOURS.callNight);
    leftover -= callNight * SHIFT_HOURS.callNight;

    // Allocate John Muir
    const johnMuir = Math.floor(leftover / SHIFT_HOURS.johnMuir);
    leftover -= johnMuir * SHIFT_HOURS.johnMuir;

    // Allocate Jeopardy Weekend
    const jeopardyWeekend = Math.floor(leftover / SHIFT_HOURS.jeopardyWeekend);

    return { serviceWeek, serviceWeekend, jeopardyWeek, jeopardyWeekend, callNight, johnMuir };
  };

  // Update shifts when remaining hours changes
  useEffect(() => {
    setShifts(calculateInitialSuggestions(remainingHours));
  }, [remainingHours]);

  const handleShiftChange = (field: keyof ShiftValues, newValue: number) => {
    const value = Math.max(0, Math.floor(newValue));
    
    // Simply update the field - no redistribution
    setShifts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalSuggestedHours = 
    shifts.serviceWeek * SHIFT_HOURS.serviceWeek +
    shifts.serviceWeekend * SHIFT_HOURS.serviceWeekend +
    shifts.jeopardyWeek * SHIFT_HOURS.jeopardyWeek +
    shifts.jeopardyWeekend * SHIFT_HOURS.jeopardyWeekend +
    shifts.callNight * SHIFT_HOURS.callNight +
    shifts.johnMuir * SHIFT_HOURS.johnMuir;

  const suggestions = [
    { label: "Service Week (5 Days)", field: 'serviceWeek' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.serviceWeek, shifts: shifts.serviceWeek },
    { label: "Service Weekend (2 days)", field: 'serviceWeekend' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.serviceWeekend, shifts: shifts.serviceWeekend },
    { label: "Jeopardy OR 4th Attending Week (5 days)", field: 'jeopardyWeek' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.jeopardyWeek, shifts: shifts.jeopardyWeek },
    { label: "Jeopardy OR 4th Attending Weekend (2 days)", field: 'jeopardyWeekend' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.jeopardyWeekend, shifts: shifts.jeopardyWeekend },
    { label: "Call Night", field: 'callNight' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.callNight, shifts: shifts.callNight },
    { label: "John Muir", field: 'johnMuir' as keyof ShiftValues, hoursPerShift: SHIFT_HOURS.johnMuir, shifts: shifts.johnMuir },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Adjust suggested shifts to plan your schedule
          </p>
          {remainingHours <= 0 && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400" data-testid="text-no-remaining">
              You've met or exceeded your expected annual hours!
            </p>
          )}
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.label}
              className="grid grid-cols-1 md:grid-cols-[1fr,140px] gap-2 md:gap-4 items-start md:items-center p-3 rounded-md bg-muted/50"
              data-testid={`suggestion-${suggestion.label.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
            >
              <div className="flex-1 space-y-1">
                <div className="font-medium text-sm text-foreground">{suggestion.label}</div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.hoursPerShift} hrs/shift • {(suggestion.shifts * suggestion.hoursPerShift).toFixed(1)} total hrs
                </div>
              </div>
              <Input
                type="number"
                min="0"
                step="1"
                value={suggestion.shifts || ''}
                onChange={(e) => handleShiftChange(suggestion.field, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="text-base font-mono"
                data-testid={`input-predicted-${suggestion.label.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Suggested Hours</span>
            <span className="text-lg font-bold font-mono text-foreground" data-testid="text-total-suggested">
              {totalSuggestedHours.toFixed(1)} hrs
            </span>
          </div>
          {totalSuggestedHours > remainingHours && (
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-2" data-testid="text-over-allocation">
              Over Allocation
            </p>
          )}
          {remainingHours > 0 && totalSuggestedHours < remainingHours - 1 && (
            <p className="text-xs text-muted-foreground mt-2">
              Remaining after suggestions: {(remainingHours - totalSuggestedHours).toFixed(1)} hrs
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
