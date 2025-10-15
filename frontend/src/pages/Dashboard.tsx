
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

export default function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      <AppointmentForm />
      <AppointmentList />
    </div>
  );
}
