import { SimpleTask } from "./SkeletonSimpleTask";

export function EndScreen() {
  return (
    <SimpleTask 
      stepNumber={14}
      stepTitle="סיום"
      mainTitle="המבדק הושלם"
      audioText="תודה רבה, המבדק הושלם בהצלחה."
      nextRoute="/dashboard"
      description={
        <div className="text-3xl text-green-700 font-bold mt-4">
          תודה רבה!
          <br /><br />
          <span className="text-xl text-gray-600 font-medium">
            הנתונים נשמרו ויעברו כעת לניתוח של הצוות המטפל.
          </span>
        </div>
      }
    />
  );
}