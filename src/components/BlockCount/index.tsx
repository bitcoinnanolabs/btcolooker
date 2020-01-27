import React from "react";
import { Button, Card, Statistic, Skeleton, Tooltip } from "antd";
import useBlockCount, { UseBlockCountReturn } from "api/hooks/use-block-count";
import { refreshActionDelay } from "components/utils";

const POLL_INTERVAL = 1000 * 30;

const BlockCount: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    blockCount: { count, unchecked, cemented },
    getBlockCount
  }: UseBlockCountReturn = useBlockCount();

  const refreshBlockCount = async () => {
    setIsLoading(true);
    await refreshActionDelay(getBlockCount);
    setIsLoading(false);
  };

  React.useEffect(() => {
    let interval: number = window.setInterval(() => {
      try {
        getBlockCount();
      } catch (_e) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = isLoading ? 0.5 : 1;

  return (
    <Card
      size="small"
      title="Block Count"
      extra={
        <Tooltip title="Reload" overlayClassName="tooltip-sm">
          <Button
            type="primary"
            icon="reload"
            size="small"
            onClick={refreshBlockCount}
            loading={isLoading}
          />
        </Tooltip>
      }
    >
      <Skeleton active loading={!count}>
        <Statistic title="Count" value={count} valueStyle={{ opacity }} />
        <Statistic
          title="Unchecked"
          value={unchecked}
          valueStyle={{ opacity }}
        />
        <Statistic title="Cemented" value={cemented} valueStyle={{ opacity }} />
      </Skeleton>
    </Card>
  );
};

export default BlockCount;
