import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Zarządzanie pacjentami</h2>

      {/* Formularz dodawania pacjenta */}
      <PatientForm onCreated={() => window.location.reload()} />

      {/* Lista pacjentów */}
      <PatientList />
    </div>
  );
}
