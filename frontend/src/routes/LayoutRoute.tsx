import { Outlet } from 'react-router-dom'
import Layout from '@/layouts/Layout'

export default function LayoutRoute() {
  return <Layout><Outlet /></Layout>
}
