import { VStack } from '@chakra-ui/react'
import LandingAnalytics from 'components/Landing/LandingAnalytics'
import LandingDemo from 'components/Landing/LandingDemo'
import LandingDomains from 'components/Landing/LandingDomains'
import LandingExamples from 'components/Landing/LandingExamples'
import LandingFooter from 'components/Landing/LandingFooter'
import LandingHero from 'components/Landing/LandingHero'
import LandingOpenSource from 'components/Landing/LandingOpenSource'
import { PosthogEvents } from 'consts/posthog'
import { trackClientEvent } from 'lib/posthog'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    trackClientEvent({ event: PosthogEvents.HIT_LANDING })
  }, [])
  return (
    <>
      <NextSeo
        title="TradLink - Simple & Free Link-In-Bio"
        description="TradLink is an opensource Linktree alternative that allows you to share all your links in one place. Add custom domains, view click statistics and more."
        canonical="https://tradlink.com"
      />

      <VStack
        minH={{ base: '80vh', lg: '95vh' }}
        justify="space-between"
        spacing={{ base: 20, lg: 48 }}
        mt={{ base: 52, lg: 60 }}
        color="black"
      >
        <LandingHero />

        <LandingDemo />

        <VStack spacing={32}>
          <LandingExamples />
          <LandingDomains />
          <LandingAnalytics />
          <LandingOpenSource />
          <LandingFooter />
        </VStack>
      </VStack>
    </>
  )
}

export default Home
