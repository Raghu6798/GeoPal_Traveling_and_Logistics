import os
import sys
from dotenv import load_dotenv
import random 
import openrouteservice
import requests
from fastmcp import FastMCP,Context
from typing import List, Tuple, Optional, Dict, Any, Union
from loguru import logger
import json
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# --- Configure Loguru Logger ---
# Remove default handler
logger.remove()

# Add console handler with custom format
logger.add(
    sys.stderr,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO",
    colorize=True
)

# Add file handler for persistent logging
logger.add(
    "logs/ors_mcp_server_{time:YYYY-MM-DD}.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    level="DEBUG",
    rotation="1 day",
    retention="30 days",
    compression="zip",
    serialize=False
)

# Add JSON file handler for structured logs
logger.add(
    "logs/ors_mcp_server_{time:YYYY-MM-DD}.json",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}",
    level="INFO",
    rotation="1 day",
    retention="30 days",
    serialize=True
)

# Configure logger for this module
logger = logger.bind(service="ors-mcp-server")

# --- Initialize Openrouteservice Client ---
logger.info("Initializing OpenRouteService MCP Server")

# Get the ORS API key from environment variables
ORS_API_KEY = os.getenv("OPENROUTE_SERVICE_API")

if not ORS_API_KEY:
    logger.critical("ORS_API_KEY environment variable not set")
    raise ValueError(
        "ORS_API_KEY environment variable not set. "
        "Please get a key from openrouteservice.org and add it to your .env file."
    )

logger.success("ORS API key loaded successfully")

try:
    ors_client = openrouteservice.Client(key=ORS_API_KEY)
    logger.success("OpenRouteService client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize OpenRouteService client: {e}")
    raise

# --- Initialize FastMCP Server ---
mcp = FastMCP(
    name="Openrouteservice MCP Server", 
    description="Provides routing, geocoding, POI services, and vehicle routing optimization via Openrouteservice."
)
logger.info("FastMCP server initialized")

# Store tool references for internal calls
_optimization_tools = {}

# --- Utility Functions for Enhanced Logging ---
def log_request_details(func_name: str, **kwargs):
    """Log request details in a structured format"""
    logger.info(
        f"API Request: {func_name}",
        extra={
            "function": func_name,
            "parameters": {k: v for k, v in kwargs.items() if k != 'ctx'},
            "timestamp": datetime.now().isoformat()
        }
    )

def log_response_summary(func_name: str, response: Dict[str, Any], success: bool = True):
    """Log response summary"""
    if success:
        logger.success(
            f"API Response: {func_name} completed successfully",
            extra={
                "function": func_name,
                "response_keys": list(response.keys()) if isinstance(response, dict) else "non-dict",
                "timestamp": datetime.now().isoformat()
            }
        )
    else:
        logger.error(f"API Response: {func_name} failed")

def safe_log_coordinates(coordinates: List[Tuple[float, float]]) -> str:
    """Safely log coordinates without exposing sensitive location data in production"""
    if len(coordinates) <= 2:
        return f"{len(coordinates)} coordinate pairs"
    return f"{len(coordinates)} waypoints"

def generate_leaflet_html(isochrone_data: Dict[str, Any], output_path: str = None) -> str:
    """
    Generates a Leaflet.js HTML file to visualize the isochrone data.
    
    Args:
        isochrone_data: The GeoJSON isochrone data from OpenRouteService
        output_path: Optional path where the HTML file should be saved.
                    If None, generates a timestamped filename.
        
    Returns:
        Path to the generated HTML file
    """
    # Generate default filename with timestamp if not provided
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = f"isochrone_map_{timestamp}.html"
    
    # Extract center point from the isochrone data
    center = isochrone_data['features'][0]['properties']['center']
    
    # Create the HTML content
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Isochrone Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
    
    <!-- Leaflet JavaScript -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
    
    <style>
        #map {{
            height: 800px;
            width: 100%;
        }}
        .info {{
            padding: 6px 8px;
            font: 14px/16px Arial, Helvetica, sans-serif;
            background: white;
            background: rgba(255,255,255,0.8);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 5px;
        }}
        .info h4 {{
            margin: 0 0 5px;
            color: #777;
        }}
        .legend {{
            line-height: 18px;
            color: #555;
        }}
        .legend i {{
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
        }}
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script>
        // Initialize the map
        var map = L.map('map').setView([{center[1]}, {center[0]}], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }}).addTo(map);
        
        // Add the isochrone data
        var isochroneData = {json.dumps(isochrone_data)};
        
        // Style for the isochrone
        var isochroneStyle = {{
            fillColor: '#3388ff',
            fillOpacity: 0.2,
            color: '#3388ff',
            weight: 2,
            opacity: 0.8
        }};
        
        // Add the isochrone to the map
        var isochroneLayer = L.geoJSON(isochroneData, {{
            style: isochroneStyle
        }}).addTo(map);
        
        // Add a marker for the center point
        var centerMarker = L.marker([{center[1]}, {center[0]}]).addTo(map)
            .bindPopup('Center Point')
            .openPopup();
            
        // Add info control
        var info = L.control();
        
        info.onAdd = function (map) {{
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        }};
        
        info.update = function () {{
            var value = isochroneData.features[0].properties.value;
            var minutes = Math.round(value / 60);
            var location = isochroneData.metadata.query.locations[0];
            this._div.innerHTML = '<h4>Isochrone Information</h4>' + 
                '<b>Travel Time:</b> ' + minutes + ' minutes<br/>' +
                '<b>Profile:</b> ' + isochroneData.metadata.query.profile + '<br/>' +
                '<b>Center:</b> ' + location[1].toFixed(6) + '°N, ' + location[0].toFixed(6) + '°E<br/>' +
                '<b>Generated:</b> ' + new Date(isochroneData.metadata.timestamp).toLocaleString();
        }};
        
        info.addTo(map);
        
        // Add legend
        var legend = L.control({{position: 'bottomright'}});
        
        legend.onAdd = function (map) {{
            var div = L.DomUtil.create('div', 'info legend');
            var value = isochroneData.features[0].properties.value;
            var minutes = Math.round(value / 60);
            
            div.innerHTML += '<h4>Legend</h4>';
            div.innerHTML += '<i style="background: #3388ff"></i> ' + minutes + ' min reachable area<br/>';
            div.innerHTML += '<i style="background: #ff0000"></i> Center Point';
            
            return div;
        }};
        
        legend.addTo(map);
        
        // Fit map bounds to isochrone
        map.fitBounds(isochroneLayer.getBounds());
    </script>
</body>
</html>
"""
    
    # Create maps directory if it doesn't exist
    os.makedirs("maps", exist_ok=True)
    
    # Write the HTML file to the maps directory
    full_path = os.path.join("maps", output_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return full_path

# --- Define MCP Tools ---

@mcp.tool
async def get_directions(
    locations: List[Tuple[float, float]],
    profile: str = "driving-car",
    preference: str = "fastest",
    optimize_waypoints: bool = False,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Calculates directions between two or more locations using OpenRouteService.

    Args:
        locations: A list of (longitude, latitude) tuples representing waypoints.
                   Example: [(8.34234, 48.23424), (8.34423, 48.26424)]
        profile: The routing profile to use (e.g., 'driving-car', 'cycling-regular', 'walking').
        preference: Route preference (e.g., 'fastest', 'shortest').
        optimize_waypoints: If True, optimizes the order of waypoints (Traveling Salesman Problem).
        ctx: The MCP context object for logging.

    Returns:
        A dictionary containing the routing response from Openrouteservice.
        The response includes:
        - routes: List of routes with distance, duration, and geometry
        - metadata: Information about the request
    """
    func_logger = logger.bind(function="get_directions")
    
    # Log request details
    log_request_details(
        "get_directions",
        locations_count=len(locations),
        profile=profile,
        preference=preference,
        optimize_waypoints=optimize_waypoints
    )
    
    # Dual logging: both loguru and MCP context
    func_logger.info(f"Calculating directions for {safe_log_coordinates(locations)} with profile '{profile}'")
    if ctx:
        await ctx.info(f"Calculating directions for {len(locations)} locations with profile '{profile}'...")
    
    try:
        func_logger.debug("Making API call to OpenRouteService directions endpoint")
        
        # Convert list of tuples to tuple of tuples as required by the API
        coords = tuple(tuple(coord) for coord in locations)
        
        routes = ors_client.directions(
            coordinates=coords,
            profile=profile,
            preference=preference,
            optimize_waypoints=optimize_waypoints
        )
        
        # Log successful response
        log_response_summary("get_directions", routes, success=True)
        func_logger.success("Directions calculation completed successfully")
        
        if ctx:
            await ctx.info("Directions calculation successful.")
            
        return routes
        
    except openrouteservice.exceptions.ApiError as api_error:
        func_logger.error(f"OpenRouteService API error: {api_error}")
        if ctx:
            await ctx.error(f"API error calculating directions: {api_error}")
        raise
    except Exception as e:
        func_logger.error(f"Error calculating directions: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error calculating directions: {e}")
        raise

@mcp.tool
async def geocode_address(
    text: str,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Geocodes an address or place name using Openrouteservice's Pelias geocoding.

    Args:
        text: The address or place name to search for (e.g. "Brandenburg Gate, Berlin, Germany").
        ctx: The MCP context object for logging.

    Returns:
        A dictionary containing the geocoding response from Openrouteservice.
    """
    func_logger = logger.bind(function="geocode_address")
    
    # Log request details (be careful with addresses for privacy)
    log_request_details(
        "geocode_address",
        text_length=len(text)
    )
    
    func_logger.info(f"Geocoding address query (length: {len(text)} chars)")
    if ctx:
        await ctx.info(f"Geocoding address: '{text}'")

    try:
        func_logger.debug("Making API call to OpenRouteService geocoding endpoint")
        
        # Simple call to pelias_search with just the text parameter
        places = ors_client.pelias_search(text=text)
        
        # Log response summary
        results_count = len(places.get('features', [])) if isinstance(places, dict) else 0
        func_logger.success(f"Geocoding completed successfully, found {results_count} results")
        log_response_summary("geocode_address", places, success=True)
        
        if ctx:
            await ctx.info("Geocoding successful.")
            
        return places
        
    except openrouteservice.exceptions.ApiError as api_error:
        func_logger.error(f"OpenRouteService API error during geocoding: {api_error}")
        if ctx:
            await ctx.error(f"API error geocoding address: {api_error}")
        raise
    except Exception as e:
        func_logger.error(f"Error geocoding address: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error geocoding address: {e}")
        raise

@mcp.tool
async def get_isochrones(
    locations: List[Tuple[float, float]],
    profile: str = "driving-car",
    range: List[float] = [300],
    range_type: str = "time",
    intervals: int = 1,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Calculates isochrones (reachability polygons) from specified locations and generates an interactive map.

    Args:
        locations: List of (longitude, latitude) tuples for isochrone centers.
                   Example: [(8.69174, 49.40875)]
        profile: The travel profile (e.g., 'driving-car', 'cycling-regular', 'walking').
        range: A list of one or more ranges for the isochrone, in seconds (for time) or meters (for distance).
               Example: [300, 600, 900] for 5, 10, 15 minutes.
        range_type: The type of range: 'time' or 'distance'.
        intervals: How many intervals to divide the range into for output polygons.
        ctx: The MCP context object for logging.

    Returns:
        A dictionary containing the isochrone response from Openrouteservice.
        Also generates an interactive HTML map in the 'maps' directory.
    """
    func_logger = logger.bind(function="get_isochrones")
    
    # Log request details
    log_request_details(
        "get_isochrones",
        locations_count=len(locations),
        profile=profile,
        range=range,
        range_type=range_type,
        intervals=intervals
    )
    
    func_logger.info(
        f"Calculating isochrones for {len(locations)} locations "
        f"with profile '{profile}' and {len(range)} range values"
    )
    if ctx:
        await ctx.info(f"Calculating isochrones for {len(locations)} locations with profile '{profile}'...")

    try:
        func_logger.debug("Making API call to OpenRouteService isochrones endpoint")
        
        isochrones = ors_client.isochrones(
            locations=locations,
            profile=profile,
            range=range,
            range_type=range_type,
            intervals=intervals
        )
        
        # Log response summary
        features_count = len(isochrones.get('features', [])) if isinstance(isochrones, dict) else 0
        func_logger.success(f"Isochrones calculation completed successfully, generated {features_count} polygons")
        log_response_summary("get_isochrones", isochrones, success=True)
        
        # Always generate the map
        try:
            # Generate a descriptive filename based on the location and time
            location_str = f"loc_{locations[0][0]:.4f}_{locations[0][1]:.4f}"
            time_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            map_filename = f"isochrone_{location_str}_{time_str}.html"
            
            map_path = generate_leaflet_html(isochrones, map_filename)
            func_logger.success(f"Generated interactive map at: {map_path}")
            if ctx:
                await ctx.info(f"Generated interactive map visualization at: {map_path}")
        except Exception as map_error:
            func_logger.error(f"Failed to generate map: {map_error}")
            if ctx:
                await ctx.error(f"Failed to generate map visualization: {map_error}")
        
        if ctx:
            await ctx.info("Isochrones calculation successful.")
            
        return isochrones
        
    except openrouteservice.exceptions.ApiError as api_error:
        func_logger.error(f"OpenRouteService API error during isochrones calculation: {api_error}")
        if ctx:
            await ctx.error(f"API error calculating isochrones: {api_error}")
        raise
    except Exception as e:
        func_logger.error(f"Error calculating isochrones: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error calculating isochrones: {e}")
        raise

@mcp.tool
async def get_pois(
    coordinates: Tuple[float, float],
    buffer: int = 1000,
    limit: int = 100,
    filters: Optional[Dict[str, Any]] = None,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Finds Points of Interest (POIs) near specified coordinates using OpenRouteService.

    Args:
        coordinates: A (longitude, latitude) tuple for the center point.
                    Example: (78.4697936, 17.3615635)

        buffer: Search radius in meters (default: 1000m). Maximum is 2000m, do not exceed 2000m.

        limit: Maximum number of POIs to return (default: 500).

        filters: Optional filters for POI categories. 
                 Expected format is a dictionary where keys are filter types and
                 values are lists of IDs. For example:
                 {
                    "category_ids": [108]  # List of integers representing category IDs
                 }
                 Always send the ID(s) as a list, i.e., [id].

                 Commonly used category IDs for **trip planning** include:
                accomodation:
    id: 100
    children:
        tourism:
            alpine_hut: 101
            apartment: 102
            camp_site: 103
            caravan_site: 104
            chalet: 105
            guest_house: 106
            hostel: 107
            hotel: 108
            motel: 109
            wilderness_hut: 110

animals:
    id: 120
    children:
        amenity:
            animal_boarding: 121
            animal_shelter: 122
            veterinary: 123
        shop:
            pet: 124

arts_and_culture:
    id: 130
    children:
        amenity:
            arts_centre: 131
            library: 133
            place_of_worship: 135
            studio: 136
        tourism:
            gallery: 132
            museum: 134

education:
    id: 150
    children:
        amenity:
            college: 151
            driving_school: 152
            kindergarten: 153
            language_school: 154
            music_school: 155
            school: 156
            university: 157

facilities:
    id: 160
    children:
        amenity:
            compressed_air: 161
            bench: 162
            emergency_phone: 163
            clock: 164
            drinking_water: 166
            hunting_stand: 168
            internet_cafe: 169
            kneipp_water_cure: 170
            post_box: 171
            recycling: 172
            sanitary_dump_station: 174
            shelter: 175
            shower: 176
            table: 177
            telephone: 178
            toilets: 179
            waste_basket: 180
            waste_disposal: 181
            water_point: 182
        emergency:
            access_point: 205
            defibrillator: 165
            fire_hydrant: 167

financial:
    id: 190
    children:
        amenity:
            atm: 191
            bank: 192
            bureau_de_change: 193

healthcare:
    id: 200
    children:
        amenity:
            baby_hatch: 201
            clinic: 202
            dentist: 203
            doctors: 204
            hospital: 206
            nursing_home: 207
            pharmacy: 208
            retirement_home: 209
            social_facility: 210
        healthcare:
            blood_donation: 211
        healthcare:speciality:
            vaccination: 212
        vaccination:
            covid19: 213

historic:
    id: 220
    children:
        historic:
            aircraft: 221
            aqueduct: 222
            archaeological_site: 223
            castle: 224
            cannon: 225
            city_gate: 226
            citywalls: 227
            battlefield: 228
            boundary_stone: 229
            building: 230
            farm: 231
            fort: 232
            gallows: 233
            highwater_mark: 234
            locomotive: 235
            manor: 236
            memorial: 237
            milestone: 238
            monastery: 239
            monument: 240
            optical_telegraph: 241
            pillory: 242
            ruins: 243
            rune_stone: 244
            ship: 245
            tomb: 246
            wayside_cross: 247
            wayside_shrine: 248
            wreck: 249

leisure_and_entertainment:
    id: 260
    children:
        leisure:
            adult_gaming_centre: 261
            amusement_arcade: 262
            beach_resort: 263
            bandstand: 264
            bird_hide: 265
            common: 266
            dance: 267
            dog_park: 268
            firepit: 269
            fishing: 270
            fitness_centre: 271
            garden: 272
            golf_course: 273
            hackerspace: 274
            horse_riding: 275
            ice_rink: 276
            marina: 277
            miniature_golf: 278
            nature_reserve: 279
            park: 280
            picnic_table: 281
            pitch: 282
            playground: 283
            sauna: 286
            slipway: 287
            sports_centre: 288
            stadium: 289
            summer_camp: 290
            swimming_area: 291
            swimming_pool: 292
            track: 293
            turkish_bath: 294
            water_park: 295
            wildlife_hide: 296
        highway:
             raceway: 284
        amenity:
            brothel: 297
            casino: 298
            cinema: 299
            dive_centre: 300
            dojo: 301
            gambling: 302
            nightclub: 303
            planetarium: 304
            public_bath: 285
            social_centre: 305
            spa: 306
            stripclub: 307
        tourism:
            aquarium: 308
            theme_park: 309
            zoo: 310

natural:
    id: 330
    children:
        natural:
            cave_entrance: 331
            beach: 332
            geyser: 333
            peak: 335
            rock: 336
            saddle: 337
            spring: 338
            volcano: 339
            water: 340

public_places:
    id: 360
    children:
        amenity:
            embassy: 361
            crematorium: 362
            community_centre: 363
            courthouse: 364
            coworking_space: 365
            crypt: 366
            fire_station: 367
            grave_yard: 368
            police: 369
            post_office: 370
            prison: 371
            ranger_station: 372
            rescue_station: 373
            townhall: 374

service:
    id: 390
    children:
        shop:
            beauty: 391
            estate_agent: 392
            dry_cleaning: 393
            glaziery: 394
            hairdresser: 395
            laundry: 396
            massage: 397
            tailor: 399
            tattoo: 400
        amenity:
            photo_booth: 398

shops:
    id: 420
    children:
        shop:
            agrarian: 421
            alcohol: 422
            antiques: 423
            art: 424
            bag: 425
            bakery: 426
            bed: 427
            beverages: 428
            bicycle: 429
            books: 430
            boutique: 431
            brewing_supplies: 432
            business_machines: 433
            butcher: 434
            cafe: 435
            camera: 436
            candles: 437
            car: 438
            car_parts: 439
            carpet: 440
            curtain: 441
            cheese: 442
            chemist: 443
            chocolate: 444
            clothes: 447
            coffee: 448
            computer: 449
            confectionery: 450
            convenience: 451
            copyshop: 452
            cosmetics: 453
            dairy: 454
            deli: 455
            department_store: 456
            doityourself: 457
            electrical: 458
            electronics: 459
            erotic: 460
            e-cigarette: 461
            farm: 462
            fashion: 463
            fishing: 464
            florist: 465
            funeral_directors: 466
            furniture: 467
            games: 468
            garden_centre: 469
            garden_furniture: 470
            gas: 471
            general: 472
            gift: 473
            greengrocer: 474
            grocery: 475
            interior_decoration: 476
            hairdresser_supply: 477
            hardware: 478
            hearing_aids: 479
            herbalist: 480
            hifi: 481
            houseware: 482
            hunting: 483
            insurance: 484
            jewelry: 485
            leather: 486
            locksmith: 487
            kiosk: 488
            kitchen: 489
            lamps: 490
            lottery: 491
            mall: 492
            medical_supply: 494
            mobile_phone: 495
            model: 496
            motorcycle: 497
            music: 498
            musical_instrument: 499
            nutrition_supplements: 500
            newsagent: 501
            optician: 502
            organic: 503
            outdoor: 504
            paint: 505
            pastry: 506
            perfumery: 507
            photo: 508
            pyrotechnics: 509
            radiotechnics: 510
            seafood: 511
            second_hand: 512
            security: 513
            shoes: 514
            spices: 515
            sports: 516
            stationery: 517
            supermarket: 518
            swimming_pool: 519
            tea: 520
            ticket: 521
            tiles: 522
            tobacco: 523
            toys: 524
            trophy: 525
            tyres: 526
            variety_store: 527
            video: 529
            video_games: 530
            watches: 531
            weapons: 532
            wine: 533
        amenity:
            marketplace: 493
            vending_machine: 528

sustenance:
    id: 560
    children:
        amenity:
            bar: 561
            bbq: 562
            biergarten: 563
            cafe: 564
            drinking_water: 565
            fast_food: 566
            food_court: 567
            ice_cream: 568
            pub: 569
            restaurant: 570

transport:
    id: 580
    children:
        aeroway:
            aerodrome: 581
            helipad: 598
            heliport: 599
        amenity:
            bicycle_parking: 583
            bicycle_rental: 584
            bicycle_repair_station: 585
            boat_sharing: 586
            bus_station: 587
            bus_stop: 588
            car_rental: 589
            car_repair: 590
            car_sharing: 591
            car_wash: 592
            charging_station: 593
            ev_charging: 594
            ferry_terminal: 595
            fuel: 596
            motorcycle_parking: 600
            parking: 601
            parking_entrance: 602
            parking_space: 603
            taxi: 606
        railway:
            halt: 597
            station: 604
            tram_stop: 605
        public_transport:
          platform: 607
          stop_position: 608
          stop_area: 609
          station: 610

tourism:
    id: 620
    children:
        tourism:
            artwork: 621
            attraction: 622
            information: 624
            picnic_site: 625
            viewpoint: 627
        amenity:
            fountain: 623
        shop:
            travel_agency: 626

                 These filters help narrow POIs to only those relevant to specific travel needs.

        ctx: The MCP context object for logging.

    Returns:
        The complete POI response object from OpenRouteService containing:
        - features: List of POI features with full details (names, categories, coordinates, properties, etc.)
        - info: Complete metadata about the request and response
        - All other fields returned by the OpenRouteService POI API
    """
    func_logger = logger.bind(function="get_pois")
    
    # Log request details
    log_request_details(
        "get_pois",
        coordinates=coordinates,
        buffer=buffer,
        limit=limit,
        filters=filters
    )
    
    func_logger.info(f"Searching for POIs around coordinates with {buffer}m buffer, limit: {limit}")
    if ctx:
        await ctx.info(f"Searching for Points of Interest around location within {buffer}m radius...")

    try:
        func_logger.debug("Making API call to OpenRouteService POIs endpoint")
        
        # Prepare the request payload
        payload = {
            "request": "pois",
            "geometry": {
                "geojson": {
                    "type": "Point",
                    "coordinates": list(coordinates)
                },
                "buffer": buffer
            },
            "limit": limit
        }
        
        # Add filters if provided
        if filters and "category_ids" in filters:
            if isinstance(filters["category_ids"], int):
                filters["category_ids"] = [filters["category_ids"]]

        
        # Prepare headers
        headers = {
            'Authorization': f'Bearer {ORS_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Make the API request
        url = 'https://api.openrouteservice.org/pois'
        func_logger.debug(f"Payload being sent to ORS: {json.dumps(payload, indent=2)}")
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            # Log response summary
            features_count = len(data.get('features', []))
            func_logger.success(f"POI search completed successfully, found {features_count} POIs")
            log_response_summary("get_pois", data, success=True)
            
            if ctx:
                await ctx.info(f"POI search successful. Found {features_count} points of interest.")
            
            return data
        else:
            error_msg = f"API request failed with status {response.status_code}: {response.text}"
            func_logger.error(error_msg)
            if ctx:
                await ctx.error(f"POI search failed: {error_msg}")
            raise Exception(error_msg)
            
    except requests.RequestException as req_error:
        func_logger.error(f"Request error during POI search: {req_error}")
        if ctx:
            await ctx.error(f"Network error during POI search: {req_error}")
        raise
    except Exception as e:
        func_logger.error(f"Error searching for POIs: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error searching for POIs: {e}")
        raise

@mcp.tool
async def get_poi_names(
    coordinates: Tuple[float, float],
    buffer: int = 1000,
    limit: int = 10,
    filters: Optional[Dict[str, Any]] = None,
    ctx: Context = None
) -> List[str]:
    """
    Gets a simplified list of POI names near specified coordinates.

    Args:
        coordinates: A (longitude, latitude) tuple for the center point.
        buffer: Search radius in meters (default: 1000m).
        limit: Maximum number of POIs to return (default: 10).
        filters: Optional filters for POI categories.
        ctx: The MCP context object for logging.

    Returns:
        A list of POI names found in the area.
    """
    func_logger = logger.bind(function="get_poi_names")
    
    func_logger.info(f"Getting POI names around coordinates with {buffer}m buffer")
    if ctx:
        await ctx.info(f"Extracting POI names within {buffer}m radius...")

    try:
        # Use the main get_pois function
        data = await get_pois(coordinates, buffer, limit, filters, ctx)
        
        # Extract names from the response
        features = data.get('features', [])
        names = []
        
        for feature in features:
            properties = feature.get('properties', {})
            osm_tags = properties.get('osm_tags', {})
            name = osm_tags.get('name')
            
            if name:
                names.append(name)
            else:
                names.append("(Unnamed landmark)")
        
        func_logger.success(f"Extracted {len(names)} POI names")
        if ctx:
            await ctx.info(f"Extracted {len(names)} POI names successfully.")
        
        return names
        
    except Exception as e:
        func_logger.error(f"Error extracting POI names: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error extracting POI names: {e}")
        raise

# --- NEW OPTIMIZATION TOOLS ---

@mcp.tool
async def optimize_vehicle_routes(
    jobs: List[Dict[str, Any]],
    vehicles: List[Dict[str, Any]],
    shipments: Optional[List[Dict[str, Any]]] = None,
    matrices: Optional[Dict[str, Any]] = None,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Solves Vehicle Routing Problems (VRP) using OpenRouteService's optimization endpoint.
    
    This is the main optimization tool that solves complex routing problems with multiple 
    vehicles, jobs, capacity constraints, time windows, and other real-world constraints.

    Args:
        jobs: List of job objects describing places to visit. Each job should have:
              - id (int): Unique identifier
              - location (List[float]): [longitude, latitude] coordinates
              - Optional: service (int): Service time in seconds
              - Optional: time_windows (List[List[int]]): Valid time slots [[start, end]]
              - Optional: amount (List[int]): Multidimensional quantities (e.g., weight, volume)
              - Optional: skills (List[int]): Required vehicle skills
              - Optional: priority (int): Priority level 0-100
              
        vehicles: List of vehicle objects describing available vehicles. Each vehicle should have:
                  - id (int): Unique identifier  
                  - start (List[float]): [longitude, latitude] starting location
                  - Optional: end (List[float]): [longitude, latitude] ending location
                  - Optional: capacity (List[int]): Vehicle capacity for each dimension
                  - Optional: skills (List[int]): Vehicle capabilities
                  - Optional: time_window (List[int]): Working hours [start, end]
                  - Optional: profile (str): Routing profile ('driving-car', 'cycling-regular', etc.)
                  
        shipments: Optional list of pickup-delivery pairs. Each shipment has:
                   - pickup: Pickup location details (similar to job)
                   - delivery: Delivery location details (similar to job)
                   - Optional: amount (List[int]): Quantities to transport
                   
        matrices: Optional custom distance/duration matrices for faster computation.
                  Format: {"profile": {"durations": [[...]], "distances": [[...]]}}
                  
        ctx: The MCP context object for logging.

    Returns:
        Complete optimization solution including:
        - code: Status code (0 = success)
        - summary: Solution statistics (cost, routes, unassigned tasks)
        - routes: Detailed route information for each vehicle
        - unassigned: Tasks that couldn't be assigned
    
    Example:
        Simple 3-job, 1-vehicle problem:
        jobs = [
            {"id": 1, "location": [2.35, 48.86], "service": 300},
            {"id": 2, "location": [2.28, 48.87], "service": 400}, 
            {"id": 3, "location": [2.36, 48.84], "service": 500}
        ]
        vehicles = [
            {"id": 1, "start": [2.35, 48.85], "end": [2.35, 48.85]}
        ]
    """
    func_logger = logger.bind(function="optimize_vehicle_routes")
    
    try:
        # Ensure each vehicle has a profile
        for vehicle in vehicles:
            if 'profile' not in vehicle:
                vehicle['profile'] = 'driving-car'  # Set default profile
        
        # Build the optimization request payload
        payload = {
            "jobs": jobs,
            "vehicles": vehicles
        }
        
        # Add optional components
        if shipments:
            payload["shipments"] = shipments
        if matrices:
            payload["matrices"] = matrices
            
        # Prepare headers
        headers = {
            'Authorization': f'Bearer {ORS_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Make the API request
        url = 'https://api.openrouteservice.org/optimization'
        func_logger.debug(f"Sending optimization request to: {url}")
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            # Add human-readable timing information
            if 'routes' in data:
                for route in data['routes']:
                    for step in route['steps']:
                        if 'arrival' in step:
                            # Convert seconds to HH:MM:SS format
                            step['arrival_time'] = f"{step['arrival']//3600:02d}:{(step['arrival']%3600)//60:02d}:{step['arrival']%60:02d}"
                        if 'duration' in step:
                            step['duration_time'] = f"{step['duration']//3600:02d}:{(step['duration']%3600)//60:02d}:{step['duration']%60:02d}"
            
            return data
        else:
            error_msg = f"Optimization API request failed with status {response.status_code}: {response.text}"
            func_logger.error(error_msg)
            if ctx:
                await ctx.error(f"Optimization failed: {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        func_logger.error(f"Error during VRP optimization: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error during optimization: {e}")
        raise

# Store the tool reference
_optimization_tools['optimize_vehicle_routes'] = optimize_vehicle_routes

@mcp.tool
async def create_simple_delivery_problem(
    delivery_locations: List[Tuple[float, float]],
    depot_location: Tuple[float, float],
    vehicle_capacity: Optional[List[int]] = None,
    service_times: Optional[List[int]] = None,
    time_windows: Optional[List[Tuple[int, int]]] = None,
    profile: str = "driving-car",
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Creates and solves a simple delivery optimization problem.
    
    This is a simplified interface for common delivery scenarios where you have:
    - One depot/warehouse location
    - Multiple delivery locations
    - One or more vehicles with similar characteristics

    Args:
        delivery_locations: List of (longitude, latitude) tuples for delivery points.
                          Example: [(2.35, 48.86), (2.28, 48.87), (2.36, 48.84)]
                          
        depot_location: (longitude, latitude) tuple for the depot/starting point.
                       Example: (2.35, 48.85)
                       
        vehicle_capacity: Optional list of integers representing vehicle capacity 
                         for different dimensions (e.g., [100] for 100 units capacity).
                         If None, assumes no capacity constraints.
                         
        service_times: Optional list of service times (in seconds) for each delivery location.
                      If None, assumes no service time. If single value provided, 
                      applies to all locations.
                      
        time_windows: Optional list of (start, end) time windows for each delivery.
                     Times are in seconds from start of planning horizon.
                     If None, assumes no time constraints.
                     
        profile: The routing profile for the vehicles
        ctx: The MCP context object for logging.

    Returns:
        Complete optimization solution with routes and statistics.
        
    Example:
        Simple 3-delivery problem:
        delivery_locations = [(2.35, 48.86), (2.28, 48.87), (2.36, 48.84)]
        depot_location = (2.35, 48.85)
        vehicle_capacity = [100]  # 100 units capacity
        service_times = [300, 400, 500]  # 5, 6.67, 8.33 minutes per delivery
    """
    func_logger = logger.bind(function="create_simple_delivery_problem")
    
    try:
        # Create jobs from delivery locations
        jobs = []
        for i, location in enumerate(delivery_locations):
            job = {
                "id": i + 1,
                "location": list(location)
            }
            
            # Add service time if provided
            if service_times:
                if isinstance(service_times, list) and len(service_times) > i:
                    job["service"] = service_times[i]
                elif isinstance(service_times, (int, float)):
                    job["service"] = int(service_times)
                elif len(service_times) == 1:
                    job["service"] = service_times[0]
            
            # Add time windows if provided
            if time_windows and len(time_windows) > i:
                job["time_windows"] = [list(time_windows[i])]
            
            # Add default delivery amount if capacity is specified
            if vehicle_capacity:
                job["delivery"] = [1] * len(vehicle_capacity)
            
            jobs.append(job)
        
        # Create vehicle with profile
        vehicle = {
            "id": 1,
            "start": list(depot_location),
            "end": list(depot_location),
            "profile": profile
        }
        
        # Add capacity if specified
        if vehicle_capacity:
            vehicle["capacity"] = vehicle_capacity
            
        vehicles = [vehicle]
        
        # Use the main optimization function directly
        result = await _optimization_tools['optimize_vehicle_routes'](
            jobs=jobs,
            vehicles=vehicles,
            ctx=ctx
        )
        
        # Add summary information
        if 'routes' in result and result['routes']:
            route = result['routes'][0]
            summary = {
                "total_distance": route.get('distance', 0),
                "total_duration": route.get('duration', 0),
                "total_service_time": route.get('service', 0),
                "total_waiting_time": route.get('waiting_time', 0),
                "total_delivery": route.get('delivery', [0])[0],
                "steps": [
                    {
                        "type": step['type'],
                        "location": step['location'],
                        "arrival_time": f"{step['arrival']//3600:02d}:{(step['arrival']%3600)//60:02d}:{step['arrival']%60:02d}",
                        "service_time": f"{step['service']//60:02d}:{step['service']%60:02d}",
                        "load": step.get('load', [0])[0]
                    }
                    for step in route['steps']
                ]
            }
            result['human_readable_summary'] = summary
        
        return result
        
    except Exception as e:
        func_logger.error(f"Error creating simple delivery problem: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error setting up delivery problem: {e}")
        raise

# Store the tool reference
_optimization_tools['create_simple_delivery_problem'] = create_simple_delivery_problem

@mcp.tool
async def optimize_traveling_salesman(
    locations: List[Tuple[float, float]],
    start_location: Optional[Tuple[float, float]] = None,
    return_to_start: bool = True,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Solves the Traveling Salesman Problem (TSP) - finding the shortest route visiting all locations.
    
    This is a specialized optimization for the classic TSP where you need to visit 
    all locations exactly once with minimal total travel time/distance.

    Args:
        locations: List of (longitude, latitude) tuples representing all locations to visit.
                  Example: [(2.35, 48.86), (2.28, 48.87), (2.36, 48.84)]
                  
        start_location: Optional (longitude, latitude) tuple for the starting point.
                       If None, optimization will choose the best starting location.
                       
        return_to_start: If True, the route will return to the starting location (round trip).
                        If False, the route will end at the last visited location.
                        
        ctx: The MCP context object for logging.

    Returns:
        Complete optimization solution including:
        - code: Status code (0 = success)
        - summary: Solution statistics (cost, routes, unassigned tasks)
        - routes: Detailed route information for each vehicle
        - unassigned: Tasks that couldn't be assigned
    """
    func_logger = logger.bind(function="optimize_traveling_salesman")
    
    # Log request details
    log_request_details(
        "optimize_traveling_salesman",
        locations_count=len(locations),
        has_start_location=start_location is not None,
        return_to_start=return_to_start
    )
    
    func_logger.info(f"Starting TSP optimization for {len(locations)} locations")
    if ctx:
        await ctx.info(f"Optimizing route to visit {len(locations)} locations...")

    try:
        # Create jobs from locations
        jobs = []
        for i, location in enumerate(locations):
            job = {
                "id": i + 1,
                "location": list(location)
            }
            jobs.append(job)
        
        # Create vehicle
        vehicle = {
            "id": 1
        }
        
        # Set start/end locations if provided
        if start_location:
            vehicle["start"] = list(start_location)
            if return_to_start:
                vehicle["end"] = list(start_location)
        elif return_to_start:
            # If no start location but return_to_start is True, use first location as depot
            vehicle["start"] = list(locations[0])
            vehicle["end"] = list(locations[0])
        
        vehicles = [vehicle]
        
        func_logger.info("Delegating to main optimization function")
        
        # Use the main optimization function
        return await optimize_vehicle_routes(
            jobs=jobs,
            vehicles=vehicles,
            ctx=ctx
        )
        
    except Exception as e:
        func_logger.error(f"Error during TSP optimization: {e}", exc_info=True)
        if ctx:
            await ctx.error(f"Error optimizing route: {e}")
        raise

if __name__=="__main__":
    logger.info("Starting OpenRouteService MCP Server with POI support")
    
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    try:
        logger.info("Server starting up...")
        mcp.run()
    except KeyboardInterrupt:
        logger.info("Server shutdown requested by user")
    except Exception as e:
        logger.critical(f"Server crashed: {e}", exc_info=True)
        raise
    finally:
        logger.info("OpenRouteService MCP Server shutdown complete")
