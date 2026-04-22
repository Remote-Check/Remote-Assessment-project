import { SimpleTask } from "./SkeletonSimpleTask";

export function AbstractionTask() {
  return (
    <SimpleTask 
      stepNumber={11}
      stepTitle="הפשטה"
      mainTitle="מה הקשר בין המילים הבאות?"
      audioText="ספר לי מה המשותף בין המילים הבאות שתשמע, למשל 'בננה ותפוז הם פירות'."
      nextRoute="/patient/delayed-recall"
      description={
        <div>
          למשל: תפוז ובננה הם פירות.
          <br /><br />
          מה משותף לרכבת ולאופניים?
          <br />
          מה משותף לשעון ולסרגל?
        </div>
      }
    />
  );
}