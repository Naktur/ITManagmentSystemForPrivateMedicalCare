
export default function Topbar() {
  return (
    <div className="h-16 bg-white shadow-md px-6 flex items-center justify-between fixed left-64 right-0 top-0 z-10">
      <h1 className="text-lg font-semibold">Panel administracyjny</h1>
      <div className="text-gray-500">Zalogowany jako: <b>Admin</b></div>
    </div>
  );
}
