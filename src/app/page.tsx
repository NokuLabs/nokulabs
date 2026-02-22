import Hero from '@/components/sections/Hero'
import Capabilities from '@/components/sections/Capabilities'
import Approach from '@/components/sections/Approach'
import Systems from '@/components/sections/Systems'
import Security from '@/components/sections/Security'
import TrustSignals from '@/components/sections/TrustSignals'
import Engagement from '@/components/sections/Engagement'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Approach />
      <Systems />
      <Security />
      <TrustSignals />
      <Engagement />
    </>
  )
}