package org.wasedacanlendar.android.network.parse

import kotlin.reflect.KClass

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class CustomParser(val value: KClass<out ResponseParser<*>>)
