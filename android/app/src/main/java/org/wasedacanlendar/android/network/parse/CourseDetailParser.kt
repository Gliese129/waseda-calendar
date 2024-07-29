package org.wasedacanlendar.android.network.parse

import dagger.Module
import org.jsoup.nodes.Document
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.model.Evaluation
import org.wasedacanlendar.android.model.FiscalQuarter
import org.wasedacanlendar.android.model.Schedule
import org.wasedacanlendar.android.model.Table
import org.wasedacanlendar.android.utils.MathUtils
import javax.inject.Inject
import javax.inject.Named

class CourseDetailParser: ResponseParser<Table> {
    override fun parse(doc: Document): Table {
        val tableData = mutableListOf<List<Pair<String, String>>>()
        doc.select("table.ct-sirabasu > tbody > tr").forEach { row ->
            val titles = row.children().filter { it ->
                it.tagName() == "th" && it.text().isNotEmpty()
            }
            val cells = row.children().filter { it ->
                it.tagName() == "td" && it.text().isNotEmpty()
            }
            if (titles.isEmpty() || cells.isEmpty()) return@forEach
            tableData.add(titles.zip(cells).map { Pair(it.first.text(), it.second.text()) })
        }
        return Table(tableData)
    }
}