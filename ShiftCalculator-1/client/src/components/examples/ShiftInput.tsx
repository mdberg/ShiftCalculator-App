import ShiftInput from '../ShiftInput';
import { useState } from 'react';

export default function ShiftInputExample() {
  const [value, setValue] = useState(3);
  
  return (
    <div className="p-8 bg-background">
      <ShiftInput 
        label="Service Weekday"
        value={value}
        onChange={setValue}
        hoursPerShift={10}
        testId="input-example"
      />
    </div>
  );
}
