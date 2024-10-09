"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
dotenv_1.default.config();
var xata_1 = require("./xata");
var xata = (0, xata_1.getXataClient)();
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var __dirname = path_1.default.resolve();
app.get("/", function (req, res) {
    res.send("Express + TypeScript Server");
});
app.get("/api/v1/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, simplifiedEvents, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, xata.db.Events.getAll()];
            case 1:
                events = _a.sent();
                if (!events) {
                    res.status(404).json({
                        message: "No events found"
                    });
                }
                simplifiedEvents = events.map(function (event) { return ({
                    eventName: event.eventName,
                    eventDate: event.eventDate
                }); });
                // Return the response with transformed event data
                res.status(200).json({
                    message: "Events retrieved from db successfully",
                    data: simplifiedEvents
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({
                    message: "An error occurred getting events"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// routing to a specific id
app.get("/api/v1/events/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, xata.db.Events.read(id)];
            case 1:
                event_1 = _a.sent();
                if (!event_1) {
                    res.status(404).json({
                        message: "Event not found"
                    });
                }
                // Return the response with transformed event data
                res.status(200).json({
                    message: "Event retrieved from db successfully",
                    data: event_1
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(500).json({
                    message: "An error occurred getting event"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// post request to create a new event
app.post("/api/v1/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event_2, newEvent, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                event_2 = req.body;
                return [4 /*yield*/, xata.db.Events.create(event_2)];
            case 1:
                newEvent = _a.sent();
                // Return the response with transformed event data
                res.status(201).json({
                    message: "Event created successfully",
                    data: newEvent
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(500).json({
                    message: "An error occurred creating event"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// put an event
app.put("/api/v1/events/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event_3, updatedEvent, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                event_3 = req.body;
                return [4 /*yield*/, xata.db.Events.update(id, event_3)];
            case 1:
                updatedEvent = _a.sent();
                // Return the response with transformed event data
                res.status(200).json({
                    message: "Event updated successfully",
                    data: updatedEvent
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                res.status(500).json({
                    message: "An error occurred updating event"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// delete an event
app.delete("/api/v1/events/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, xata.db.Events.delete(id)];
            case 1:
                _a.sent();
                // Return the response with transformed event data
                res.status(200).json({
                    message: "Event deleted successfully"
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(500).json({
                    message: "An error occurred deleting event"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
