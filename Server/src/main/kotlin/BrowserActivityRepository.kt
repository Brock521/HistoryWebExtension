package com.example.browseractivity

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import java.time.Instant


interface BrowserActivityRepository: CrudRepository<BrowserActivityData,Long>  {

    @Query("""
    MERGE INTO BROWSERACTIVITYDATA AS TARGET
    USING (VALUES (:url, :title, :startTime, :endTime, :lastAccessed, :timesAccessed)) AS SOURCE(URL, TITLE, START_TIME, END_TIME, LAST_ACCESSED, TIMES_ACCESSED)
    ON TARGET.URL = SOURCE.URL
    WHEN MATCHED THEN
        UPDATE SET TARGET.TITLE = SOURCE.TITLE, 
                  TARGET.START_TIME = SOURCE.START_TIME, 
                  TARGET.END_TIME = SOURCE.END_TIME, 
                  TARGET.LAST_ACCESSED = SOURCE.LAST_ACCESSED, 
                  TARGET.TIMES_ACCESSED = COALESCE(TARGET.TIMES_ACCESSED, 0) + SOURCE.TIMES_ACCESSED
    WHEN NOT MATCHED THEN
        INSERT (URL, TITLE, START_TIME, END_TIME, LAST_ACCESSED, TIMES_ACCESSED)
        VALUES (SOURCE.URL, SOURCE.TITLE, SOURCE.START_TIME, SOURCE.END_TIME, SOURCE.LAST_ACCESSED, SOURCE.TIMES_ACCESSED);
""")
    @Modifying
    fun upsert(
        url: String,
        title: String?,
        startTime: Instant?,
        endTime: Instant?,
        lastAccessed: Instant?,
        timesAccessed: Int
    ): Int



}