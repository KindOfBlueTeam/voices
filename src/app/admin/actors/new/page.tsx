import NewActorForm from "@/components/admin/NewActorForm";

interface Props {
  searchParams: { name?: string };
}

export default function NewActorPage({ searchParams }: Props) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Voice Actor</h1>
        <p className="text-gray-400 text-sm mt-1">
          Use Wikipedia Lookup to pre-fill details, or fill in manually. You can add characters after saving.
        </p>
      </div>

      <NewActorForm initialName={searchParams.name ?? ""} />
    </div>
  );
}
