import ResultsDisplay from '../ResultsDisplay';

export default function ResultsDisplayExample() {
  const breakdown = [
    { category: "Service Weekday", shifts: 3, hoursPerShift: 10, totalHours: 30 },
    { category: "Jeopardy Weekday", shifts: 2, hoursPerShift: 2.5, totalHours: 5 },
    { category: "Service Weekend", shifts: 1, hoursPerShift: 10, totalHours: 10 },
  ];
  
  return (
    <div className="p-8 bg-background max-w-md">
      <ResultsDisplay breakdown={breakdown} totalHours={45} expectedAnnualHours={1400} />
    </div>
  );
}
