import { VStack } from '@chakra-ui/react'
import { AnalyticAPIReturnData } from 'pages/api/analytics/getdata'
import { useEffect, useState } from 'react'

import LinkClicks from './LinkClicks'
import PageViews from './PageViews'
import TimeSeries from './TimeSeries'
import TrafficSources from './TrafficSources'

const Analyitcs = () => {
  const [analyticData, setAnalyticData] = useState<AnalyticAPIReturnData | null>(null)

  const hitAPI = async () => {
    const apiResponse = await fetch('/api/analytics/getdata')
    const data = await apiResponse.json()
    setAnalyticData(data)
  }

  useEffect(() => {
    if (analyticData === null) hitAPI()
  }, [])

  return (
    <>
      <VStack align="left" spacing={4}>
        <PageViews totalPageViews={analyticData?.totalHits} />
        <TimeSeries timeSeries={analyticData?.timeSeriesData} />
        <LinkClicks totalLinkClicks={analyticData?.topLinks} />
        <TrafficSources trafficSources={analyticData?.trafficSources} />
      </VStack>
    </>
  )
}
export default Analyitcs
