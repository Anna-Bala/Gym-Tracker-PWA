import { Typography } from "@/components/base/Typography";
import ReportBmi from "./ReportBmi";
import ReportSummary from "./ReportSummary";

const Report = () => {
  return (
    <section className="flex flex-col">
      <Typography className="w-full text-center font-semibold mb-6" variant="h2">
        Report
      </Typography>
      <div className="flex flex-col gap-6">
        <ReportSummary />
        <ReportBmi />
      </div>
    </section>
  );
};

export default Report;
