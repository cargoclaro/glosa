import { getRecentAnalysis } from "@/app/services/customGloss/controller";
import { GlossHistory, Header, MexMap, MyInfo, Summary } from "./components";
import type { Metadata } from "next";
import { ICustomGloss } from "@/app/interfaces";

export const metadata: Metadata = {
  title: "Administración",
};

const HomePage = async () => {
  const myLatestGlosses = (await getRecentAnalysis()) as ICustomGloss[];
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
