import { SimpleTask } from "./SimpleTask";

export function SerialSevensTask() {
  return (
    <SimpleTask 
      stepNumber={8}
      stepTitle="סדרת 7"
      mainTitle="חיסור עוקב של 7 מ-100"
      audioText="אנא התחל מ-100 והחסר בכל פעם 7, עד שאומר לך לעצור."
      taskId="serial7"
      description={
        <div>
          החסר 7 מ-100, ולאחר מכן החסר שוב 7 מהמספר שקיבלת,
          <br />וכן הלאה (למשל: 100, 93, 86...)
          <br /><br />
          אמור את התשובות בקול רם. המערכת תקליט אותך.
        </div>
      }
    />
  );
}