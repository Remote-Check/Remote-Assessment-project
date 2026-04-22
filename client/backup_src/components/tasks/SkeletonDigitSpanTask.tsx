import { SimpleTask } from "./SkeletonSimpleTask";

export function DigitSpanTask() {
  return (
    <SimpleTask 
      stepNumber={6}
      stepTitle="קיבולת זיכרון"
      mainTitle="חזרה על מספרים"
      audioText="אקריא לך מספרים, חזור עליהם בדיוק באותו הסדר."
      nextRoute="/patient/vigilance"
      description={
        <div>
          המערכת תקריא סדרת מספרים קדימה, ואחריה סדרת מספרים אחורה. 
          <br /><br />
          אנא חזור עליהם כעת בקול רם.
        </div>
      }
    />
  );
}