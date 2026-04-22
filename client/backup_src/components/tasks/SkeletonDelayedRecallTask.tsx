import { SimpleTask } from "./SkeletonSimpleTask";

export function DelayedRecallTask() {
  return (
    <SimpleTask 
      stepNumber={12}
      stepTitle="שליפה מאוחרת"
      mainTitle="האם אתה זוכר את המילים?"
      audioText="כעת, חזור על חמשת המילים שביקשתי ממך לזכור בתחילת המבדק."
      nextRoute="/patient/orientation"
      description={
        <div>
          אמור בקול רם את כל 5 המילים שביקשנו ממך לזכור קודם לכן. 
          <br />
          (במידה ויש צורך, יושמעו לך רמזים).
        </div>
      }
    />
  );
}