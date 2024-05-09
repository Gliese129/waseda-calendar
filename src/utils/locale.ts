/// I hate full-width characters
/// guess why this file is named 'locale.ts'?
const full2Half = (str: string): string => {
    let res = str
    for (let i = 0; i < str.length; i++) {
    // full-width number
        if (str.charCodeAt(i) >= 65296 && str.charCodeAt(i) <= 65305) {
            res = res.replace(str[i], String.fromCharCode(str.charCodeAt(i) - 65248))
        }
        // full-width alphabet
        if (str.charCodeAt(i) >= 65313 && str.charCodeAt(i) <= 65338) {
            res = res.replace(str[i], String.fromCharCode(str.charCodeAt(i) - 65248))
        }
    }
    // full-width space and slash
    res = res.replaceAll('　', ' ').replaceAll('／', '/')
    return res
}

const dayOfWeek = {
    日: 7,
    月: 1,
    火: 2,
    水: 3,
    木: 4,
    金: 5,
    土: 6,
}

export { full2Half, dayOfWeek }
