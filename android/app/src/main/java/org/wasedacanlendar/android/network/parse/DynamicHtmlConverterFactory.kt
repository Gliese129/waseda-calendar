package org.wasedacanlendar.android.network.parse

import androidx.glance.LocalContext
import okhttp3.ResponseBody
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.wasedacanlendar.android.R
import retrofit2.Converter
import retrofit2.Retrofit
import java.lang.reflect.Type
import javax.inject.Inject

class DynamicHtmlConverterFactory: Converter.Factory() {

    override fun responseBodyConverter(
        type: Type, annotations: Array<Annotation>, retrofit: Retrofit
    ): Converter<ResponseBody, *>? {
        annotations.forEach { annotation ->
            if (annotation is CustomParser) {
                val parser = annotation.value.java.getDeclaredConstructor().newInstance()
                parser?.let {
                    return Converter<ResponseBody, Any> { responseBody ->
                        it.parse(transformHtml(responseBody.string()))
                    }
                }
            }
        }
        return null
    }

    private fun transformHtml(html: String): Document {
        html.replace(
            Regex("[Ａ-Ｚａ-ｚ０-９＋－＊／＝＜＞（）［］｛｝，．：；？！＆＃％＠｜]")
        ) {
            it.value[0].code.minus(0xFEE0).toChar().toString()
        }.replace("　", " ").replace("・", "/")
        .let {

            return Jsoup.parse(it)
        }
    }
}