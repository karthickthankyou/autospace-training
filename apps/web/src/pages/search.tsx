import Head from 'next/head'
import { SearchPageTemplate } from '@autospace-org/ui/src/components/templates/SearchPageTemplate'
import { FormProviderSearchGarage } from '@autospace-org/forms/src/searchGarages'

export default function Search() {
  return (
    <>
      <Head>
        <title>Autospace - Search parking garages</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FormProviderSearchGarage>
          <SearchPageTemplate />
        </FormProviderSearchGarage>
      </main>
    </>
  )
}
