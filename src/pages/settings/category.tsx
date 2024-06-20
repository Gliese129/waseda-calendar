import { key } from '@/store'
import { computed, defineComponent, h, inject } from 'vue'
import {
  VCheckbox,
  VList,
  VListItem,
  VListItemAction,
  VListSubheader,
} from 'vuetify/components'
import { useStore } from 'vuex'
import { useLocale } from 'vuetify'
import { useRouter } from 'vue-router'
import ActionListItem from '@/components/ActionListItem.vue'

h('div') // This is a placeholder for the JSX function

export default defineComponent({
  name: 'UserInfo',
  setup() {
    const $message = inject('$message') as Function
    const store = useStore(key)
    const router = useRouter()
    const { t } = useLocale()

    const scheduleGroup = computed(() => [
      {
        title: t('settings.periods'),
        description: t('settings.periodsDescription'),
        icon: 'mdi-clock-time-four-outline',
        route: '/settings/periods',
      },
    ])
    const dangerGroup = computed(() => [
      {
        title: t('settings.clearCache'),
        description: t('settings.clearCacheDescription'),
        icon: 'mdi-delete',
        action: async () => {
          await store.dispatch('syllabus/forceRefresh')
          $message(t('notification.cacheCleared'), 'success')
        },
      },
    ])
    const generalGroup = computed(() => [
      {
        title: t('settings.courseNotification'),
        description: t('settings.courseNotificationDescription'),
        icon: 'mdi-bell',
        modelValue: computed({
          get: () => store.state.user.courseNotification,
          set: (value) => store.commit('user/setCourseNotification', value),
        }),
      },
    ])

    return () => (
      <VList class="mx-2">
        <VListSubheader color="grey">{t('settingGroup.schedule')}</VListSubheader>
        {scheduleGroup.value.map((item) => (
          <VListItem
            class="text-left select-none"
            title={item.title}
            prependIcon={item.icon}
            subtitle={item.description}
            onClick={() => router.push(item.route)}
          ></VListItem>
        ))}

        <VListSubheader color="blue">{t('settingGroup.general')}</VListSubheader>
        {generalGroup.value.map((item) => (
          <VListItem
            class="text-left select-none"
            title={item.title}
            prependIcon={item.icon}
            subtitle={item.description}
            onClick={() => {
              item.modelValue.value = !item.modelValue.value
            }}
          >
            {{
              append: () => (
                <VListItemAction end>
                  <VCheckbox
                    modelValue={item.modelValue}
                    color="primary"
                    hideDetails
                    readonly
                  ></VCheckbox>
                </VListItemAction>
              ),
            }}
          </VListItem>
        ))}

        <VListSubheader color="red">{t('settingGroup.dangerZone')}</VListSubheader>
        {dangerGroup.value.map((item) => (
          <ActionListItem
            class="text-left select-none"
            title={item.title}
            icon={item.icon}
            description={item.description}
            action={item.action}
          ></ActionListItem>
        ))}
      </VList>
    )
  },
})
