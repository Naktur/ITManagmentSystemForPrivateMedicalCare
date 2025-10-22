import { useState } from "react";
import ReceptionistForm from "../components/ReceptionistForm";
import ReceptionistList from "../components/ReceptionistList";

export default function ReceptionistsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <ReceptionistForm onCreated={() => setRefresh((r) => r + 1)} />
      <ReceptionistList key={refresh} />
    </div>
  );
}
