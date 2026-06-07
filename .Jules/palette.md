## 2024-05-18 - Missing loading state on CSV export
**Learning:** ClinicianDashboardList and ClinicianDashboardDetail have a "ייצוא CSV" (Export CSV) button that disables itself during export, but the UX feels unresponsive because it doesn't display a loading spinner or change its icon while exporting. It relies solely on a text change, which is easy to miss.
**Action:** Add a loading spinner and 'aria-busy' state to async action buttons to improve user feedback during long-running tasks.
