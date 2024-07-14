package org.wasedacanlendar.android.network.parse

import org.jsoup.nodes.Document

interface ResponseParser<T> {
    fun parse(doc: Document): T
}