import { registerPlugin } from '@capacitor/core'
import type { CourseNotificationPlugin } from './definitions'

const CourseNotification = registerPlugin<CourseNotificationPlugin>('CourseNotification')

export * from './definitions'
export { CourseNotification }
