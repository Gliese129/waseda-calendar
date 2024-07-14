package org.wasedacanlendar.android.utils

object MathUtils {
    fun gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)
    fun lcm(x: List<Int>): Int {
        var result = 1
        for (i in x) {
            result = result * i / gcd(result, i)
        }
        return result
    }
}