
import DoctorForm from "../components/DoctorForm";
import DoctorList from "../components/DoctorList";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Zarządzanie lekarzami</h2>

      {/* Formularz dodawania lekarza */}
      <DoctorForm onCreated={() => window.location.reload()} />

      {/* Lista lekarzy */}
      <DoctorList />
    </div>
  );
}
