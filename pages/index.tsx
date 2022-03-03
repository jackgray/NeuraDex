import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

// Custom imports
import constants from './constants'

async function fetchApi(endpoint: string) {
  const response = await fetch(`/api/${endpoint}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

const Home: NextPage = () => {
  const [isLoadingSubject, setLoadingSubject] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [apiError, setApiError] = useState(null)

  const getApiCallback = (endpoint: string) => async () => {
    setLoadingSubject(true)
    setApiError(null)

    try {
      const response = await fetchApi(endpoint)
      setApiResponse(response)
    } catch (e: any) {
      console.error(e)
      setApiError(e)
    }

    setLoadingSubject(false)
  }

  const onGetStatus = getApiCallback('')
  const onSeed = getApiCallback('seed')
  const onGetUsers = getApiCallback('users')
  const onGetSubjects = getApiCallback('subjects')

  return (
    <div className={styles.container}>
      <Head>
        <title>{constants.appName}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{constants.appDesc}</h1>

        <div className={styles.grid}>
          <button onClick={onGetStatus} className={styles.apiButton}>
            Check API status
          </button>
          <button onClick={onSeed} className={styles.apiButton}>
            Seed data
          </button>
          <button onClick={onGetUsers} className={styles.apiButton}>
            Load projects with profiles
          </button>
          <button onClick={onGetSubjects} className={styles.apiButton}>
            Load subjects
          </button>
          <div
            className={`${styles.loader} ${isLoadingSubject ? '' : styles.hidden}`}
          ></div>
        </div>
        <pre
          className={`responseContainer ${styles.code} ${
            apiResponse ? '' : styles.hidden
          }`}
        >
          {apiResponse && JSON.stringify(apiResponse, null, 2)}
        </pre>
      </main>

      <footer className={styles.footer}>
        Powered by Columbia University Medical Center + Mount Sinai School of Medicine
        <img
          src="/vercel.svg"
          alt="Vercel Logo"
          className={styles.logo}
          width={71}
          height={16}
        />
        &
        <Image
          src="/prisma.svg"
          alt="Prisma Logo"
          className={styles.logo}
          width={32}
          height={16}
        />
      </footer>
    </div>
  )
}

export default Home