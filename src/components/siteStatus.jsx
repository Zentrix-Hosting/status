import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { formatNumber, formatDuration } from "@/utils/timeTools";
import { LinkTwo } from "@icon-park/react";
import { Tooltip, Button, Result, Modal } from "antd";
import CustomLink from "@/components/customLink";
import SiteCharts from "@/components/siteCharts";

const SiteStatus = ({ siteData, days, status }) => {
  // Modal data
  const [siteDetailsShow, setSiteDetailsShow] = useState(false);
  const [siteDetailsData, setSiteDetailsData] = useState(null);

  // Whether to show links
  const isShowLinks = import.meta.env.VITE_SHOW_LINKS === "true";

  // Open modal
  const showSiteDetails = (data) => {
    setSiteDetailsShow(true);
    setSiteDetailsData(data);
  };

  // Close modal
  const closeSiteDetails = () => {
    setSiteDetailsShow(false);
    setSiteDetailsData(null);
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={status.siteState} classNames="fade" timeout={100}>
        {status.siteState !== "wrong" ? (
          status.siteState !== "loading" && siteData ? (
            <div className="sites">
              {siteData.map((site) => (
                <div
                  key={site.id}
                  className={`site ${
                    site.status !== "ok" ? "error" : "normal"
                  }`}
                >
                  <div className="meta">
                    <div className="name">{site.name}</div>
                    {isShowLinks ? (
                      <CustomLink iconDom={<LinkTwo />} to={site.url} />
                    ) : null}
                    <div
                      className={`status ${
                        site.status === "ok"
                          ? "normal"
                          : site.status === "unknown"
                          ? "unknown"
                          : "error"
                      }`}
                    >
                      <div className="icon" />
                      <span className="tip">
                        {site.status === "ok"
                          ? "Accessible"
                          : site.status === "unknown"
                          ? "Status Unknown"
                          : "Inaccessible"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="timeline"
                    onClick={() => {
                      showSiteDetails(site);
                    }}
                  >
                    {site.daily.map((data, index) => {
                      const { uptime, down, date } = data;
                      const time = date.format("YYYY-MM-DD");
                      let status = null;
                      let tooltipText = null;
                      if (uptime >= 100) {
                        status = "normal";
                        tooltipText = `Uptime ${formatNumber(uptime)}%`;
                      } else if (uptime <= 0 && down.times === 0) {
                        status = "none";
                        tooltipText = "No data";
                      } else {
                        status = "error";
                        tooltipText = `Failures ${
                          down.times
                        } times, total ${formatDuration(
                          down.duration
                        )}, uptime ${formatNumber(uptime)}%`;
                      }
                      return (
                        <Tooltip
                          key={index}
                          // trigger={["hover", "click"]}
                          title={
                            <div className="status-tooltip">
                              <div className="time">{time}</div>
                              <div className="text">{tooltipText}</div>
                            </div>
                          }
                          destroyTooltipOnHide
                        >
                          <div className={`line ${status}`} />
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="summary">
                    <div className="now">Today</div>
                    <div className="note">
                      {site.total.times
                        ? `In the last ${days} days, ${site.total.times} failures, total ${formatDuration(
                            site.total.duration
                          )}, average uptime ${site.average}%`
                        : `Uptime in the last ${days} days ${site.average}%`}
                    </div>
                    <div className="day">
                      {site.daily[site.daily.length - 1].date.format(
                        "YYYY-MM-DD"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Site details */}
              <Modal
                title={siteDetailsData?.name}
                open={siteDetailsShow}
                footer={null}
                onOk={closeSiteDetails}
                onCancel={closeSiteDetails}
                bodyStyle={{ marginTop: "20px" }}
              >
                <SiteCharts siteDetails={siteDetailsData} />
              </Modal>
            </div>
          ) : (
            <div className="loading" />
          )
        ) : (
          <Result
            status="error"
            title="Request limit exceeded or error, please refresh and try again"
            extra={
              <Button
                type="primary"
                danger
                onClick={() => {
                  location.reload();
                }}
              >
                Retry
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default SiteStatus;
