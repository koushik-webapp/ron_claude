import GallerySection from '../components/GallerySection'

export const metadata = {
  title: 'Gallery | Rainey Removal LLC',
  description: 'See our real work — junk removal, moving jobs, cleanouts, and more across New Jersey.',
}

export default function GalleryPage() {
  return (
    <main className="bg-zinc-950 overflow-x-hidden pt-[60px]">
      <GallerySection />
    </main>
  )
}
