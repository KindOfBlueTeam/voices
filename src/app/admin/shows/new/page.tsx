import Link from "next/link";
import NewShowForm from "@/components/admin/NewShowForm";

export default function NewShowPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/shows" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← All shows
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Show / Movie</h1>
        <p className="text-gray-400 text-sm mt-1">
          Save the show, then use Cast Lookup to find and add its voice actors.
        </p>
      </div>

      <NewShowForm />
    </div>
  );
}
