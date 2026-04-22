import { Link } from "react-router";
import { User, ShieldCheck } from "lucide-react";

export function LandingHub() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Heebo',sans-serif]"
    >
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6">
            RC
          </div>
          <h1 className="text-5xl font-extrabold text-black mb-4">
            Remote Check
          </h1>
          <p className="text-xl text-gray-500">
            הערכה נוירופסיכולוגית ממוחשבת
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Link
            to="/patient/trail-making"
            className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-black transition-all group text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-black mb-3">
              כניסת נבדק
            </h2>
            <p className="text-gray-500 text-lg">
              מעבר לתחילת מבחן מוקה מרחוק
            </p>
          </Link>

          <Link
            to="/dashboard"
            className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-black transition-all group text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-black mb-3">
              פורטל קלינאי
            </h2>
            <p className="text-gray-500 text-lg">
              מעבר לניהול מטופלים וצפייה בתוצאות
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}