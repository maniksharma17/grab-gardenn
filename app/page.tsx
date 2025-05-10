// app/page.tsx or any route
import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/products')
}
