import Link from "next/link";

const GlossIdPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div>
      GlossIdPage {id}
      <Link href={`/gloss/${id}/analysis`}>Analysis</Link>
    </div>
  );
};

export default GlossIdPage;
