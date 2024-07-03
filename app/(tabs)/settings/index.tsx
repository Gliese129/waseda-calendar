import { Link, Stack, Tabs } from 'expo-router'
import React from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useTranslation } from 'react-i18next'
import { View, Text } from 'react-native'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { t } = useTranslation()

  const tabs: {
    name: string
    title: string
    icon: 'settings'
  }[] = [
    {
      name: 'index',
      title: t('navigation.settings'),
      icon: 'settings',
    }
  ]

  return (
    <View >
      <Stack.Screen
        options={{
          title: 'My home',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerTitle: props => <div>{props}</div>,
        }}
      />
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'details', params: { name: 'Bacon' } }}>Go to Details</Link>
    </View>
  )
}
