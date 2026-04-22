import { SimpleTask } from "./SkeletonSimpleTask";

export function OrientationTask() {
  return (
    <SimpleTask 
      stepNumber={13}
      stepTitle="התמצאות"
      mainTitle="התמצאות בזמן ובמקום"
      audioText="ספר לי בבקשה מהו התאריך המלא היום, ובאיזה מקום אנחנו נמצאים."
      nextRoute="/patient/end"
      description={
        <div className="flex flex-col gap-6 items-center w-full">
          אנא ענה על השאלות הבאות בקול רם:
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-xl text-right mt-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
             <div className="font-bold border-b border-gray-200 pb-2">יום בחודש</div>
             <div className="font-bold border-b border-gray-200 pb-2">חודש</div>
             <div className="font-bold border-b border-gray-200 pb-2">שנה</div>
             <div className="font-bold border-b border-gray-200 pb-2">יום בשבוע</div>
             <div className="font-bold">מקום/מוסד</div>
             <div className="font-bold">עיר</div>
          </div>
        </div>
      }
    />
  );
}