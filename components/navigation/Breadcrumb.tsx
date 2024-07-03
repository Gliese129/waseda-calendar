import { Link } from 'expo-router'
import { Text } from 'react-native'

interface BreadCrumbProps {
  items: {
    name: string
    path: string
  }[]
  separator: string
}

export function BreadCrumb({ items, separator = '/' }: BreadCrumbProps) {
  const breadcrumbs = items.map((item, index) => (
    <Link href={item.path} key={index}>
      {item.name}
    </Link>
  ))

  return (
    <>
      {breadcrumbs.flatMap((breadcrumb, index) => [
        breadcrumb,
        index < breadcrumbs.length - 1 && <Text key={index}>{separator}</Text>,
      ])}
    </>
  )
}
