import Banner from '@/src/components/home/Banner'
import CategorySection from '@/src/components/home/CategorySection'
import Faq from '@/src/components/home/Faq'
import React from 'react'

export default function page() {
  return (
    <div>
      <Banner></Banner>
      <CategorySection />
      <Faq></Faq>
    </div>
  )
}
