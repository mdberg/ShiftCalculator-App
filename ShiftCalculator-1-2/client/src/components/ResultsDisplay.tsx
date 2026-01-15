import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShiftBreakdown {
  category: string;
  shifts: number;
  hoursPerShift: number;
  totalHours: number;
}

interface ResultsDisplayProps {
  breakdown: ShiftBreakdown[];
  totalHours: number;
  expectedAnnualHours: number;
}

export default function ResultsDisplay({ breakdown, totalHours, expectedAnnualHours }: ResultsDisplayProps) {
  const activeBreakdown = breakdown.filter(item => item.shifts > 0);
  const percentageComplete = expectedAnnualHours > 0 ? (totalHours / expectedAnnualHours) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
            <p 
              data-testid="text-total-hours" 
              className="text-4xl font-bold font-mono text-foreground"
            >
              {totalHours.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">hours</p>
          </div>
        </CardContent>
      </Card>

      {expectedAnnualHours > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Expected Annual Hours</span>
                <span className="text-sm font-mono text-foreground" data-testid="text-expected-hours">
                  {expectedAnnualHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm font-mono text-foreground" data-testid="text-progress">
                  {percentageComplete.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Remaining</span>
                <span className="text-sm font-mono text-foreground" data-testid="text-remaining">
                  {Math.max(0, expectedAnnualHours - totalHours).toFixed(1)} hrs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeBreakdown.map((item, index) => (
              <div 
                key={index}
                data-testid={`breakdown-item-${index}`}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-foreground">{item.category}</span>
                <span className="font-mono text-muted-foreground">
                  {item.shifts} × {item.hoursPerShift} = <span className="text-foreground font-medium">{item.totalHours.toFixed(1)} hrs</span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
