import { initTablesQuery, initUserQuery } from '@/database/initTables'
import type { SQLiteDBConnection } from '@capacitor-community/sqlite'
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { ref } from 'vue'

export default async function useSQLiteDB() {
    const db = ref<SQLiteDBConnection | null>(null)
    const sqlite = ref<SQLiteConnection | null>(null)
    const initialized = ref(false)

    const initDB = async () => {
        if (sqlite.value) return

        sqlite.value = new SQLiteConnection(CapacitorSQLite)
        const ret = await sqlite.value.checkConnectionsConsistency()
        const isConnected = (await sqlite.value.isConnection('sqlite', false)).result

        if (ret.result && isConnected) {
            db.value = await sqlite.value.retrieveConnection('sqlite', false)
        } else {
            db.value = await sqlite.value.createConnection(
                'sqlite',
                false,
                'no-encryption',
                1,
                false
            )
        }
    }

    const initTables = async () => {
        if (!db.value) return
        await db.value.open()
        await db.value.execute(initTablesQuery)
        await db.value.execute(initUserQuery)
        await db.value.close()
    }

    try {
        await initDB()
        await initTables()
        initialized.value = true
    } catch (error: any) {
        console.error('initDB error', error)
        initialized.value = false
    }

    const performSQLAction = async (
        action: (db: SQLiteDBConnection) => Promise<void>,
        cleanup?: () => Promise<void>
    ) => {
        if (!db.value) return
        try {
            await db.value.open()
            await action(db.value as SQLiteDBConnection)
        } catch (error: any) {
            console.log(error)
        } finally {
            const isOpen = (await db.value.isDBOpen()).result
            if (isOpen) await db.value.close()
            if (cleanup) await cleanup()
        }
    }

    return { initialized, performSQLAction }
}

export type SQLiteAction = (
    action: (db: SQLiteDBConnection) => Promise<void>,
    cleanup?: () => Promise<void>
) => Promise<void>
