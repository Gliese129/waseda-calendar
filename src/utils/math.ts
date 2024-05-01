const gcd = (a: number, b: number): number => {
    if (b === 0) return a
    return gcd(b, a % b)
}

const lca = (x: number[]): number => {
    let res = x[0]
    for (let i = 1; i < x.length; i++) {
        res = (res * x[i]) / gcd(res, x[i])
    }
    return res
}

export { lca, gcd }
