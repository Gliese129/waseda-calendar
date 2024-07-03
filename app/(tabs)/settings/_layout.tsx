import { Stack } from 'expo-router'
import React from 'react'

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

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
        <Stack
        screenOptions={{
            headerTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
        }}
        / >
  )
}
