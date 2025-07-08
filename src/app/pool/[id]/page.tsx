export async function generateStaticParams() {
  // TODO: these are just for development. remove it
  const ids = ['1', '2', '3'];

  return ids.map((id) => ({ id }));
}

export default function EditPoolPage({ params }: { params: { id: string } }) {
  return <div>Editing Pool: {params.id}</div>;
}
