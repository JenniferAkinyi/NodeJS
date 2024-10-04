const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dataFilePath = path.join(__dirname, 'data.json');

// Helper function to read data from the JSON file
const readData = () => {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// READ: Get all events
router.get('/', (req, res) => {
    const events = readData();
    res.status(200).json(events);
});

// READ: Get a single event by ID
// /1 -> id === 1
router.get('/:id', (req, res) => {
    const events = readData();
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
});

// CREATE: Add a new event
router.post('/', (req, res) => {
    const events = readData();
    const newEvent = {
        id: events.length + 1, 
        ...req.body 
    };
    events.push(newEvent);
    writeData(events); // Write updated events to file
    res.status(201).json(newEvent);
});

// UPDATE: Update an existing event by ID
router.put('/:id', (req, res) => {
    const events = readData();
    const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event's properties
    events[eventIndex] = { ...events[eventIndex], ...req.body };
    writeData(events); // Write the updated data to the file
    res.status(200).json(events[eventIndex]);
});

// DELETE: Remove an event by ID
router.delete('/:id', (req, res) => {
    const events = readData();
    const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Remove the event
    const deletedEvent = events.splice(eventIndex, 1);
    writeData(events); // Write the updated data back to the file
    res.status(200).json(deletedEvent[0]);
});

module.exports = router;
