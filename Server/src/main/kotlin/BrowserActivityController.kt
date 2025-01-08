package com.example.browseractivity;

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriComponentsBuilder
import java.security.Principal

@RestController
@RequestMapping("BrowserActivity/Api")
internal class BrowserActivityController(private val browserActivityRepository: BrowserActivityRepository) {

    @PostMapping
    fun createBrowserActivityEntries(
        @RequestBody newBrowserActivities: List<BrowserActivityData>
    ): ResponseEntity<Map<String, Int>> {
        var itemsUpdated = 0

        // Process each activity and count updates
        newBrowserActivities.forEach { activity ->
            val updatedRows = browserActivityRepository.upsert(
                url = activity.url ?: throw IllegalArgumentException("URL must not be null"),
                title = activity.title,
                startTime = activity.startTime,
                endTime = activity.endTime,
                lastAccessed = activity.lastAccessed,
                timesAccessed = activity.timesAccessed
            )
            itemsUpdated += updatedRows
        }

        // Return the number of items updated or created
        return ResponseEntity.ok(mapOf("itemsUpdated" to itemsUpdated))
    }

    @GetMapping
    fun getAllBrowserActivityEntries(): ResponseEntity<List<BrowserActivityData>>{

        var browsingActivityDataRetrieved = browserActivityRepository.findAll().toList();

        return ResponseEntity.ok(browsingActivityDataRetrieved);
    }
}