/**
 * This store contains states of system
 */

export interface SystemState {
    currRoute: {
        name: string
        path: string
        index: number
    }
}

// const baseFolder = 'system/'

export const systemStore = {
    state: {
        currRoute: {},
    },
    mutations: {
        setCurrRoute(state: SystemState, currRoute: any) {
            state.currRoute = currRoute
        },
    },
    actions: {
        async updateRoute({ commit }: { commit: any }, currRoute: any) {
            commit('setCurrRoute', currRoute)
        },
    },
}
