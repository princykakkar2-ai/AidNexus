import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function InteractiveMap({ problems = [], onPinClick = null }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [zoomLevel, setZoomLevel] = useState(5);
  
  // Geocode helper for coordinates
  const getCoordinates = (prob, index) => {
    if (!prob.location) return [20.5937, 78.9629];
    const parts = prob.location.split(",").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    
    const locLower = prob.location.toLowerCase();
    if (locLower.includes("delhi")) return [28.6139 + (index * 0.03), 77.2090 - (index * 0.03)];
    if (locLower.includes("jaipur")) return [26.9124 + (index * 0.03), 75.7873 - (index * 0.03)];
    if (locLower.includes("chennai")) return [13.0827 + (index * 0.03), 80.2707 - (index * 0.03)];
    if (locLower.includes("noida")) return [28.5355 + (index * 0.03), 77.3910 - (index * 0.03)];
    if (locLower.includes("palampur") || locLower.includes("hp")) return [32.1109 + (index * 0.03), 76.5363 - (index * 0.03)];
    if (locLower.includes("hyderabad")) return [17.3850 + (index * 0.03), 78.4867 - (index * 0.03)];
    if (locLower.includes("mumbai")) return [19.0760, 72.8777];
    if (locLower.includes("bangalore") || locLower.includes("bengaluru")) return [12.9716, 77.5946];
    
    // Spread markers deterministically based on index
    const offsetLat = (index * 1.5) % 10 - 5;
    const offsetLng = (index * 2.3) % 12 - 6;
    return [20.5937 + offsetLat, 78.9629 + offsetLng];
  };

  // Create markers with custom HTML
  const createCustomMarker = (status, priority, isCluster = false, count = 1) => {
    if (isCluster) {
      return L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0B2545] text-white font-extrabold text-[11px] border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform">
            ${count}
          </div>
        `,
        className: "custom-cluster-marker",
        iconSize: L.point(32, 32),
        iconAnchor: L.point(16, 16)
      });
    }

    // High/Critical = Red, Medium/Low = Yellow, Resolved = Green
    let markerColor = "bg-rose-500 border-rose-200 shadow-rose-500/50";
    if (status === "RESOLVED") {
      markerColor = "bg-emerald-500 border-emerald-200 shadow-emerald-500/50";
    } else if (priority === "LOW" || priority === "MEDIUM") {
      markerColor = "bg-amber-500 border-amber-200 shadow-amber-500/50";
    }

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <span class="absolute inline-flex h-6 w-6 rounded-full opacity-35 animate-ping ${markerColor.split(' ')[0]}"></span>
          <div class="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-md text-[9px] font-black ${markerColor.split(' ')[0]} text-white">
            📍
          </div>
        </div>
      `,
      className: "custom-pin-marker",
      iconSize: L.point(24, 24),
      iconAnchor: L.point(12, 12)
    });
  };

  // Custom clustering calculations
  const getClusteredPins = (filteredList, zoom) => {
    const threshold = 2.0 / Math.pow(1.6, zoom - 4);
    const clusters = [];
    const visited = new Set();
    
    const items = filteredList.map((prob, index) => ({
      prob,
      coords: getCoordinates(prob, index)
    }));

    for (let i = 0; i < items.length; i++) {
      if (visited.has(i)) continue;
      
      const current = items[i];
      const cluster = [current];
      visited.add(i);
      
      for (let j = i + 1; j < items.length; j++) {
        if (visited.has(j)) continue;
        const target = items[j];
        
        const dist = Math.sqrt(
          Math.pow(current.coords[0] - target.coords[0], 2) +
          Math.pow(current.coords[1] - target.coords[1], 2)
        );
        
        if (dist < threshold) {
          cluster.push(target);
          visited.add(j);
        }
      }
      
      if (cluster.length > 1) {
        const avgLat = cluster.reduce((sum, item) => sum + item.coords[0], 0) / cluster.length;
        const avgLng = cluster.reduce((sum, item) => sum + item.coords[1], 0) / cluster.length;
        clusters.push({
          isCluster: true,
          coords: [avgLat, avgLng],
          problems: cluster.map(c => c.prob)
        });
      } else {
        clusters.push({
          isCluster: false,
          coords: current.coords,
          prob: current.prob
        });
      }
    }
    return clusters;
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // CartoDB Voyager map tiles layer
      const map = L.map(mapContainerRef.current, {
        center: [21.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: false, 
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'topleft' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      // Event listener for map zoom changes
      map.on("zoomend", () => {
        setZoomLevel(map.getZoom());
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Markers when properties or filters change
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // Filter problems list
    const filtered = problems.filter(prob => {
      const catMatch = filterCategory === "All" || prob.category.toLowerCase() === filterCategory.toLowerCase();
      
      const probPriority = prob.priority || "MEDIUM";
      const prioMatch = filterPriority === "All" || 
        (filterPriority === "HIGH" && (probPriority === "HIGH" || probPriority === "CRITICAL")) ||
        (filterPriority === "MEDIUM" && probPriority === "MEDIUM") ||
        (filterPriority === "LOW" && probPriority === "LOW");
        
      return catMatch && prioMatch;
    });

    const clusters = getClusteredPins(filtered, zoomLevel);

    clusters.forEach((item) => {
      if (item.isCluster) {
        const marker = L.marker(item.coords, {
          icon: createCustomMarker(null, null, true, item.problems.length)
        });
        
        // Popup detailing clustered issues
        const popupContent = document.createElement("div");
        popupContent.className = "p-2 max-w-[220px] text-[#0B2545] font-sans";
        popupContent.innerHTML = `
          <h5 class="font-extrabold text-xs border-b border-slate-100 pb-1.5 mb-1.5 uppercase text-slate-700">
            📦 Clustered Reports (${item.problems.length})
          </h5>
          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${item.problems.map((p) => `
              <div class="text-[10px] pb-1 border-b border-dashed border-slate-100 last:border-b-0">
                <span class="text-[7.5px] font-black uppercase text-slate-400 block">${p.category}</span>
                <a href="#" class="font-extrabold hover:text-[#E65C00] uppercase block truncate text-slate-800 text-[9.5px] cluster-item-link" data-id="${p._id || p.id}">
                  ${p.title}
                </a>
                <span class="text-[8px] text-[#E65C00] font-semibold">${p.status.replace("_", " ")}</span>
              </div>
            `).join('')}
          </div>
        `;

        // Handle item click inside cluster popup list
        popupContent.addEventListener("click", (e) => {
          const link = e.target.closest(".cluster-item-link");
          if (link) {
            e.preventDefault();
            const id = link.getAttribute("data-id");
            if (onPinClick) onPinClick(id);
          }
        });

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          mapRef.current.setView(item.coords, mapRef.current.getZoom() + 1);
        });
        marker.addTo(markersGroupRef.current);
      } else {
        const prob = item.prob;
        const marker = L.marker(item.coords, {
          icon: createCustomMarker(prob.status, prob.priority)
        });

        // Detailed issue popup card
        const popupContent = `
          <div class="p-2.5 max-w-[210px] text-[#0B2545] font-sans">
            <span class="text-[8px] font-black uppercase text-slate-400 block tracking-wider">${prob.category}</span>
            <h4 class="font-extrabold text-[11px] mt-1 leading-tight text-[#0B2545] uppercase">${prob.title}</h4>
            <p class="text-[9.5px] text-slate-500 mt-1.5 leading-relaxed line-clamp-3">${prob.description || prob.desc || 'No description provided.'}</p>
            <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[8px] font-black uppercase tracking-wide">
              <span class="text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-black">${prob.priority || 'MEDIUM'}</span>
              <span class="text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-bold">${prob.status.replace("_", " ")}</span>
            </div>
            <a href="/problems/${prob._id || prob.id}" class="block text-center mt-3 bg-[#0B2545] hover:bg-[#134074] text-white text-[8.5px] font-extrabold py-1.5 rounded uppercase tracking-wider transition-colors shadow-xs">
              View Details →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (onPinClick) {
            onPinClick(prob._id || prob.id);
          }
        });
        marker.addTo(markersGroupRef.current);
      }
    });

  }, [problems, filterCategory, filterPriority, zoomLevel]);

  // Reset Map View Control
  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([21.5937, 78.9629], 5);
    }
  };

  // Full Screen Control
  const toggleFullScreen = () => {
    const mapDiv = mapContainerRef.current;
    if (!document.fullscreenElement) {
      mapDiv.requestFullscreen().catch((err) => {
        console.warn("Fullscreen mode failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative h-full w-full border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-slate-50 shadow-inner">
      {/* MAP VIEWER PORT */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

      {/* FLOATING LEGEND (Bottom Left Corner) */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-md p-3 z-[1000] shadow-md select-none text-left max-w-40 animate-fadeIn">
        <h5 className="text-[9px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-1.5">
          🗺️ Map Legend
        </h5>
        <div className="space-y-1.5 text-[8.5px] font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-200 flex-shrink-0"></span>
            <span>High / Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-200 flex-shrink-0"></span>
            <span>Medium / Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-200 flex-shrink-0"></span>
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="w-4 h-4 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[7px] font-black scale-90 flex-shrink-0">
              3
            </span>
            <span>Clustered Pins</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL PANEL OVERLAY (Top Right Corner) */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-md p-3.5 z-[1000] shadow-md flex flex-col sm:flex-row gap-3 min-w-48 sm:min-w-[280px]">
        <div className="flex-1">
          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
            Filter Department
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="All">All Departments</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Roads">Roads</option>
            <option value="Electricity">Electricity</option>
            <option value="Environment">Environment</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
            Filter Priority
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="HIGH">High / Critical</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* EXTRA CONTROLS OVERLAY (Bottom Right Corner) */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={resetView}
          className="w-8 h-8 rounded bg-white hover:bg-slate-50 border border-slate-200 text-[#0B2545] shadow-md flex items-center justify-center text-xs font-black transition-colors cursor-pointer"
          title="Reset Map View"
        >
          🔄
        </button>
        <button
          onClick={toggleFullScreen}
          className="w-8 h-8 rounded bg-white hover:bg-slate-50 border border-slate-200 text-[#0B2545] shadow-md flex items-center justify-center text-xs font-black transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
