// @ts-nocheck
import LoadingScreen from 'components/Auth/LoadingScreen'
import NoUserScreen from 'components/Auth/NoUserScreen'
import Editor from 'components/Editor'
import EditorHeader from 'components/Headers/EditorHeader'
import { PosthogEvents } from 'consts/posthog'
import { trackClientEvent } from 'lib/posthog'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { KyteProdContext, UserContext } from 'pages/_app'
import { useContext, useEffect, useState } from 'react'
import { TKyteProdContext, TUserContext } from 'types/user'

const Edit = () => {
  const { user, setUser } = useContext(UserContext) as TUserContext
  const { kyteProd } = useContext(KyteProdContext) as TKyteProdContext

  const router = useRouter()
  const [route, setRoute] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())

    gtag('event', 'conversion', {
      send_to: `${process.env.NEXT_PUBLIC_GTAG}/${process.env.NEXT_PUBLIC_GTAG_CONVERSION}`,
    })

    trackClientEvent({ event: PosthogEvents.HIT_EDIT, id: user?.id })
  }, [])

  useEffect(() => {
    if (router.query.edit && router.query.edit.length > 2) {
      setRoute(router.query.edit as string)
    }

    const timer = setTimeout(() => {
      if (!user) setError(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [router.query.edit])

  if (error && !user) return <NoUserScreen />
  if (route === null || !user) return <LoadingScreen />

  return (
    <>
      <NextSeo title="TradLink | Edit" />
      <EditorHeader user={user} />
      <Editor user={user} setUser={setUser} kyteProd={kyteProd} route={route} />
    </>
  )
}

export default Edit
