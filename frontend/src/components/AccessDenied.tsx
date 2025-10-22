
export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-3xl font-semibold text-red-600 mb-2">Brak uprawnień 🔒</h1>
      <p className="text-gray-600 mb-4">
        Nie masz dostępu do tej sekcji. Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
      </p>
      <a
        href="/dashboard"
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
      >
        Wróć do panelu głównego
      </a>
    </div>
  );
}
