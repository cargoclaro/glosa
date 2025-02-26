import { getRecentAnalysis } from "@/app/shared/services/customGloss/controller";
import { Header, MyInfo, MexMap, Summary, GlossHistory } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración",
};

const HomePage = async () => {
  const myLatestGlosses = (await getRecentAnalysis());
  if (!myLatestGlosses) {
    return <div>No hay glosas recientes</div>;
  }
  return (
    <article>
      <Header />
      <section className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <MyInfo />
          <MexMap />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <Summary />
          <GlossHistory history={myLatestGlosses} />
        </div>
      </section>
    </article>
  );
};

export default HomePage;
