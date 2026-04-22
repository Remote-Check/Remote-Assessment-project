import { SimpleTask } from "./SkeletonSimpleTask";

export function LanguageTask() {
  return (
    <SimpleTask 
      stepNumber={9}
      stepTitle="שפה"
      mainTitle="חזרה על משפטים ושטף מילולי"
      audioText="אקריא לך משפט, חזור אחריו במדויק. לאחר מכן נבדוק את אוצר המילים שלך באות מסוימת."
      nextRoute="/patient/abstraction"
      description={
        <div>
          ראשית, חזור בקול רם על שני המשפטים שתשמע.
          <br /><br />
          לאחר מכן, תתבקש למנות כמה שיותר מילים המתחילות באות מסוימת, במשך דקה אחת.
        </div>
      }
    />
  );
}