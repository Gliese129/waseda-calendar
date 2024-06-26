import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'org.wasedacalendar.app',
    appName: 'Waseda Calendar',
    webDir: 'dist',
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
        BackgroundRunner: {},
        CapacitorSQLite: {},
    },
}

export default config
