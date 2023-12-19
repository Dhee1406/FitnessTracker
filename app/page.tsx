"use client "
import Homebanner1 from '@/components/Homebanner1/Homebanner1'
import Homebanner2 from '@/components/Homebanner2/Homebanner2'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Homebanner1 />
      <Homebanner2 />
    </main>
  )
}
