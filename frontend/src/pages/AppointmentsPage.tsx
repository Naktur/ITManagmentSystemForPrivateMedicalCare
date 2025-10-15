
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Zarządzanie wizytami</h2>
      <AppointmentForm />
      <AppointmentList />
    </div>
  );
}
