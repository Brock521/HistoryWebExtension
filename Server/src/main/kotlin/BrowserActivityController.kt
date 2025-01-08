package com.example.browseractivity;

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("BrowserActivity/Api")
@CrossOrigin
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