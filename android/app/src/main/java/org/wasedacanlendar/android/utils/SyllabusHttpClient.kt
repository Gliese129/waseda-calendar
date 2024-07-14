package org.wasedacanlendar.android.utils

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.wasedacanlendar.android.network.parse.DynamicHtmlConverterFactory
import retrofit2.Retrofit

object SyllabusHttpClient {
    private const val BASE_URL = "https://www.wsl.waseda.jp/syllabus/"

    private val logging: HttpLoggingInterceptor by lazy {
        HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
    }

    private val client: OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(logging)
        .build()

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(DynamicHtmlConverterFactory())
            .client(client)
            .build()
    }

    fun <T> create(clazz: Class<T>): T {
        return retrofit.create(clazz)
    }
}