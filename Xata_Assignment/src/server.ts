import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config()
import { getXataClient } from "./xata";
const xata = getXataClient()

const app: Express = express()
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//const __dirname = path.resolve();

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/api/v1/events", async (req: Request, res: Response) => {
    try {
        const events = await xata.db.Events.getAll();

        if (!events) {
                res.status(404).json({
                message: "No events found"
            });
        }

        // Transform the response to include only relevant fields
        const simplifiedEvents = events.map(event => ({
            Name: event.Name,
            itemId: event.itemId,
            Price: event.Price,
            imageUrl: event.imageUrl,
            company: event.company,
        }));
        console.log(simplifiedEvents)

        // Return the response with transformed event data
        res.status(200).json({
            message: "Events retrieved from db successfully",
            data: simplifiedEvents
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred getting events"
        });
    }
});

// routing to a specific id
app.get("/api/v1/events/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const event = await xata.db.Events.read(id);

        if (!event) {
                res.status(404).json({
                message: "Event not found"
            });
        }

        // Return the response with transformed event data
        res.status(200).json({
            message: "Event retrieved from db successfully",
            data: event
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred getting event"
        });
    }
});

// post request to create a new event
app.post("/api/v1/events", async (req: Request, res: Response) => {
    try {
        const event = req.body;
        const newEvent = await xata.db.Events.create(event);

        // Return the response with transformed event data
        res.status(201).json({
            message: "Event created successfully",
            data: newEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred creating event"
        });
    }
});

// put an event
app.put("/api/v1/events/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const event = req.body;
        const updatedEvent = await xata.db.Events.update(id, event);

        // Return the response with transformed event data
        res.status(200).json({
            message: "Event updated successfully",
            data: updatedEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred updating event"
        });
    }
});

// delete an event
app.delete("/api/v1/events/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await xata.db.Events.delete(id);

        // Return the response with transformed event data
        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred deleting event"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
