import { Typography } from "@/components/base/Typography";
import ReportSummary from "./ReportSummary";

const Report = () => {
  return (
    <section className="flex flex-col">
      <Typography className="w-full text-center font-semibold mb-6" variant="h2">
        Report
      </Typography>
      <ReportSummary />
    </section>
  );
};

export default Report;
