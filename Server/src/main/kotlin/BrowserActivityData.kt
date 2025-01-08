package com.example.browseractivity;

import java.time.Instant
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column

@Table("BROWSERACTIVITYDATA")
data class BrowserActivityData(
    @Id
    @Column("URL")
    val url: String?,
    @Column("TITLE")
    val title: String?,
    @Column("START_TIME")
    val startTime: Instant?,
    @Column("END_TIME")
    val endTime: Instant?,
    @Column("LAST_ACCESSED")
    val lastAccessed: Instant?,
    @Column("TIMES_ACCESSED")
    val timesAccessed: Int
)
