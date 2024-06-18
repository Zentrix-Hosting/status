import { Alert, Collapse } from "antd";
import { MacScrollbar } from "mac-scrollbar";
import { Line } from "@ant-design/plots";

const SiteCharts = ({ siteDetails }) => {
  // Process incoming data for the chart
  const dailyData = siteDetails.daily;
  const chartData = [...dailyData].reverse().map((data) => {
    const { uptime, date } = data;
    return {
      time: date.format("YYYY-MM-DD"),
      value: uptime,
    };
  });

  // Chart configuration
  const chartConfig = {
    data: chartData,
    padding: "auto",
    xField: "time",
    yField: "value",
    offsetY: 0,
    meta: {
      value: {
        alias: "Daily Uptime",
        formatter: (v) => `${v}%`,
      },
    },
    xAxis: {
      tickCount: chartData.length,
    },
    smooth: true,
  };

  return (
    <MacScrollbar style={{ maxHeight: "66vh" }}>
      <div className="site-details">
        {siteDetails.status !== "ok" ? (
          siteDetails.average >= 70 ? (
            <Alert
              message="The site is currently experiencing issues. Please check the site status."
              type="warning"
              showIcon
            />
          ) : (
            <Alert
              message="The site has ongoing issues. Please check the site status immediately or remove it from monitoring."
              type="error"
              showIcon
            />
          )
        ) : (
          <Alert
            message="The site is operating normally. Keep up the good work!"
            type="success"
            showIcon
          />
        )}
        <div className="all">
          <Line {...chartConfig} />
          <Collapse
            style={{ marginTop: "20px" }}
            items={[
              {
                key: "all-data",
                label: "Initial Site Data",
                children: <p>{JSON.stringify(siteDetails)}</p>,
              },
            ]}
          />
        </div>
      </div>
    </MacScrollbar>
  );
};

export default SiteCharts;
