import { SimpleTask } from "./SimpleTask";

export function DigitSpanTask() {
  return (
    <SimpleTask 
      stepNumber={6}
      stepTitle="קיבולת זיכרון"
      mainTitle="חזרה על מספרים"
      audioText="אקריא לך סדרת מספרים קדימה. כשאסיים, חזור עליהם בדיוק באותו הסדר."
      pacedItems={["2", "1", "8", "5", "4", "ועכשיו סדרת מספרים אחורה. חזור עליהם בסדר הפוך כשאסיים.", "7", "4", "2"]}
      taskId="digitSpan"
      description={
        <div>
          המערכת תקריא סדרת מספרים קדימה, ואחריה סדרת מספרים אחורה. 
          <br /><br />
          לחץ על התחל הקלטה וחזור עליהם כעת בקול רם.
        </div>
      }
    />
  );
}