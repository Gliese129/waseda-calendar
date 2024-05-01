enum Season {
    spring,
    summer,
    autumn,
    winter,
}

export const semesterJp = [
    {
        name: '春学期',
        value: [Season.spring, Season.summer],
    },
    {
        name: '秋学期',
        value: [Season.autumn, Season.winter],
    },
    {
        name: '通年',
        value: [Season.spring, Season.summer, Season.autumn, Season.winter],
    },
    {
        name: 'その他',
        value: [],
    },
    {
        name: '春クォーター',
        value: [Season.spring],
    },
    {
        name: '夏クォーター',
        value: [Season.summer],
    },
    {
        name: '秋クォーター',
        value: [Season.autumn],
    },
    {
        name: '冬クォーター',
        value: [Season.winter],
    },
    {
        name: '夏季集中',
        value: [Season.summer],
    },
    {
        name: '冬季集中',
        value: [Season.winter],
    },
    {
        name: '春季集中',
        value: [Season.spring],
    },
    {
        name: '秋季集中',
        value: [Season.autumn],
    },
]
