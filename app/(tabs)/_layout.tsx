import { Tabs } from 'expo-router'
import React from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useTranslation } from 'react-i18next'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { t } = useTranslation()

  const tabs: {
    name: string
    title: string
    icon: 'home' | 'settings' | 'search'
  }[] = [
    {
      name: 'index',
      title: t('navigation.calendar'),
      icon: 'home',
    },
    {
      name: 'search',
      title: t('navigation.search'),
      icon: 'search',
    },
    {
      name: 'settings',
      title: t('navigation.settings'),
      icon: 'settings',
    },
  ]

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            // eslint-disable-next-line
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? tab.icon : `${tab.icon}-outline`}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
