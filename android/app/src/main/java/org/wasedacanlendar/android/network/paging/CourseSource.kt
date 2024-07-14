package org.wasedacanlendar.android.network.paging

import androidx.paging.PagingSource
import androidx.paging.PagingState
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.network.api.CourseApi
import org.wasedacanlendar.android.utils.SyllabusHttpClient
import retrofit2.HttpException
import java.io.IOException

class CourseSource(
    private val keyword: String?,
    private val name: String?,
    private val semester: Int?,
    private val weekday: Int?,
    private val period: Int?,
    private val school: String?
): PagingSource<Int, Course>(){

    override fun getRefreshKey(state: PagingState<Int, Course>): Int? {
        return null
    }
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, Course> {
        val nextPage = params.key ?: 1
        return try {
            val data = SyllabusHttpClient.create(CourseApi::class.java).getCourseList(
                keyword = keyword,
                name = name,
                semester = semester,
                weekday = weekday,
                period = period,
                school = school,
                page = nextPage,
                amount = params.loadSize
            )

            LoadResult.Page(
                data = data,
                prevKey = if(nextPage == 1) null else nextPage - 1,
                nextKey = if (data.isEmpty()) null else nextPage + 1
            )
        } catch (e: IOException) {
            LoadResult.Error(e)
        } catch (e: HttpException) {
            LoadResult.Error(e)
        }
    }
}