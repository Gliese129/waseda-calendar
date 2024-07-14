package org.wasedacanlendar.android.network.api

import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.network.parse.CourseIntrosParser
import org.wasedacanlendar.android.network.parse.CustomParser
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.POST

interface CourseApi {

    @FormUrlEncoded
    @POST("index.php")
    @CustomParser(CourseIntrosParser::class)
    suspend fun getCourseList(
        @Field("keyword") keyword: String?,
        @Field("name") name: String?,
        @Field("p_gakki") semester: Int?,
        @Field("p_youbi") weekday: Int?,
        @Field("p_jigen") period: Int?,
        @Field("p_gakubu") school: String?,
        @Field("pLng") lang: String = "ja",
        @Field("p_number") amount: Int = 20,
        @Field("p_page") page: Int = 1,
        @Field("ControllerParameters") cp: String = "JAA103SubCon",
    ): List<Course>
}